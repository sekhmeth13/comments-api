<script lang="ts">
    import List, {
        Item,
        Graphic,
        Text,
        PrimaryText,
        SecondaryText,
    } from "@smui/list";
    import IconButton from "@smui/icon-button";
    import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";
    import Button, { Label } from "@smui/button";
    import type { Comment } from "../types";
    export let comments: Comment[];
    export let nonInteractive: boolean = false;
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    import { Router, Route, navigate } from "svelte-routing";
    dayjs.extend(relativeTime);
    export let user: string;
    export let articleId: string = "";
    let addingResponseTo;
    $: addingResponseTo;
    $: comments;
    let newResponseToComment: string;

    function addResponseToNestedComment(
        commentId,
        response: Comment,
        comments: Comment[]
    ) {
        comments.every((c) => {
            if (c.id === commentId) {
                console.log(response);
                c.responses.unshift(response);
                return;
            } else {
                addResponseToNestedComment(commentId, response, c.responses);
            }
        });
    }
    async function sendComment(
        comment: Pick<Comment, "originalCommentId" | "articleId" | "content">
    ) {
        const parsedUser = JSON.parse(user);
        const serverResponse = await fetch("http://localhost:3000/comments", {
            method: "POST",
            body: JSON.stringify({ ...comment, authorId: parsedUser.id }),
        });
        const createdComment = (await serverResponse.json()).data;
        console.log({ createdComment });
        if (comment.originalCommentId) {
            addResponseToNestedComment(
                comment.originalCommentId,
                createdComment,
                comments
            );
            comments = comments;
        }
    }
</script>

<List class="comment-list" threeLine avatarList bind:nonInteractive>
    {#each comments as comment (comment)}
        <Item on:SMUI:click={() => navigate(`/${comment.article.title}.html`)}>
            <Graphic
                style="background-image: url(https://place-hold.it/40x40?text={comment.author.nickname.substring(
                    0,
                    1
                )}&fontsize=16)"
            />
            {comment.content}
            <div class="comment-infos">
                <span class="author-nickname">{comment.author.nickname}</span>
                {dayjs(comment.createdAt).fromNow()}
            </div>
            {#if user}
                <IconButton
                    class="material-icons"
                    on:click={() => (addingResponseTo = comment.id)}
                    touch>reply</IconButton
                >
                {#if addingResponseTo === comment.id}
                    <div class="new-comment-block">
                        <textarea bind:value={newResponseToComment} />
                        <Button
                            on:click={async () => {
                                await sendComment({
                                    content: newResponseToComment,
                                    originalCommentId: comment.id,
                                    articleId,
                                });
                            }}
                            variant="raised"
                        >
                            <Label>Raised</Label>
                        </Button>
                    </div>
                {/if}
            {/if}
        </Item>

        {#if comment.responses?.length > 0}
            <div class="comment-response">
                <Accordion>
                    <Panel>
                        <Header>responses</Header>
                        <Content>
                            <svelte:self
                                comments={comment.responses}
                                nonInteractive
                                {articleId}
                                bind:user
                            />
                        </Content>
                    </Panel>
                </Accordion>
            </div>
        {/if}
    {/each}
</List>

<style>
    .author-nickname {
        font-weight: bold;
    }
    :global(.comment-infos) {
        text-align: right;
    }

    :global(.comment-list) {
        width: 600px;
        margin: auto;
    }
    :global(.comment-text) {
        display: block;
        text-overflow: ellipsis;
    }
</style>
