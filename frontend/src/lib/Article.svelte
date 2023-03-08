<script lang="ts">
    import { onMount } from "svelte";
    import type { Article, Comment } from "../types";

    export let articleId: string;
    $: articleId;
    let articleWithComments: Article & {
        comments: (Comment & {
            comments: Comment[];
        })[];
    };
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
    });
</script>

<div class="article">
    <h1>{articleWithComments?.title}</h1>
    <div class="article-content">{articleWithComments?.content}</div>
</div>

<style>
</style>
