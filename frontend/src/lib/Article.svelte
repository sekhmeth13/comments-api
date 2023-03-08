<script lang="ts">
    import { onMount } from "svelte";
    import type { Article, Comment } from "../types";
    import Card, { Content } from "@smui/card";
    import List, {
        Item,
        Graphic,
        Text,
        PrimaryText,
        Separator,
        SecondaryText,
    } from "@smui/list";
    import Textfield, { Input } from "@smui/textfield";
    import HelperText from "@smui/textfield/helper-text";
    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    dayjs.extend(relativeTime);
    export let articleId: string;
    $: articleId;
    let articleWithComments: Article & {
        comments: (Comment & {
            comments: Comment[];
        })[];
    };
    let newComment = "";
    onMount(async () => {
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
        <List class="comment-list" avatarList nonInteractive>
            {#each articleWithComments.comments as comment}
                <Item>
                    <Graphic
                        style="background-image: url(https://place-hold.it/40x40?text={comment.author.nickname.substring(
                            0,
                            1
                        )}&fontsize=16)"
                    />
                    <Text style="width: 100%">
                        <PrimaryText class="comment-text"
                            >{comment.content}</PrimaryText
                        >
                        <SecondaryText class="comment-infos">
                            <span class="author-nickname"
                                >{comment.author.nickname}</span
                            >
                            {dayjs(comment.createdAt).fromNow()}
                        </SecondaryText>
                    </Text>
                </Item>
            {/each}
        </List>
        <textarea />
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
