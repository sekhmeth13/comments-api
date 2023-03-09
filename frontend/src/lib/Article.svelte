<script lang="ts">
    import { onMount } from "svelte";
    import type { Article, Comment } from "../types";

    import Button, { Label } from "@smui/button";
    import IconButton from "@smui/icon-button";
    import List, { Separator } from "@smui/list";
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    import CommentList from "./CommentList.svelte";
    import googleOneTap from "google-one-tap";
    dayjs.extend(relativeTime);
    export let articleId: string;
    $: articleId;
    let articleWithComments: Article & {
        comments: (Comment & {
            comments: Comment[];
        })[];
    };

    let newComment = "";
    let user = localStorage.authenticatedUser;
    $: newComment;
    $: user;

    // articleIds.subscribe((value) => {
    //     console.log({ value });
    //     articleIdsValue = value;
    // });

    const addNewComment = async (event: CustomEvent<any>) => {
        const response = await fetch("http://localhost:3000/comments"); // add the body. If in response to, add the commentId
        if (!response.ok) {
            const message = await response.json();
            console.error(message);
            return;
        }
        const createdComment = (await response.json()).data;
        console.log(createdComment);
    };

    onMount(async () => {
        if (!localStorage.authenticatedUser) {
            const options = {
                client_id:
                    "992397750279-s30dmhd3v1u0qbfpc738tmopu15nv741.apps.googleusercontent.com",
            };

            await googleOneTap(options, async ({ credential }) => {
                const serverResponse = await fetch(
                    "http://localhost:3000/login/google",
                    {
                        method: "POST",
                        body: JSON.stringify({ credential }),
                    }
                );
                // Send response to server
                localStorage.authenticatedUser = JSON.stringify(
                    (await serverResponse.json()).data
                );
                user = localStorage.authenticatedUser;
            });
        }

        const response = await fetch(
            "http://localhost:3000/articles/" + articleId
        );
        if (!response.ok) {
            const message = await response.json();
            console.error(message);
            return;
        }
        articleWithComments = (await response.json()).data;
        console.log(articleWithComments);
    });
</script>

<div class="article">
    {#if articleWithComments === undefined}
        Loading Article...
    {:else}
        <h1>{articleWithComments?.title}</h1>
        <div class="article-content">{articleWithComments?.content}</div>
        <Separator />
        <CommentList
            comments={articleWithComments.comments}
            articleId={articleWithComments.id}
            nonInteractive
            bind:user
        />
        {#if user}
            <div class="new-comment-block">
                <textarea bind:value={newComment} />
                <Button on:click={addNewComment} variant="raised">
                    <Label>Raised</Label>
                </Button>
            </div>
        {/if}
    {/if}
</div>

<style>
    h1 {
        text-align: center;
    }
    .article-content {
        font-size: 21px;
        font-family: R;
        width: 900px;
        margin: auto;
        margin-bottom: 15px;
    }
    textarea {
        display: block;
        margin: auto;
        width: 600px;
        height: 150px;
    }
</style>
