<script lang="ts">
  import RecentComments from "./lib/RecentComments.svelte";
  import { Router, Route, navigate } from "svelte-routing";
  import Article from "./lib/Article.svelte";
  import detectChangeUrl from "detect-url-change";
  import type { Comment } from "./types";
  import { onMount } from "svelte";
  let articleIds: { article1?: string; article2?: string } = {};
  let comments: Comment[];

  export let url = "";
  $: articleIds;

  detectChangeUrl.on("change", (newUrl) => navigate(newUrl));

  onMount(async () => {
    const response = await fetch("http://localhost:3000/comments");
    if (!response.ok) {
      const message = await response.json();
      console.error(message);
      return;
    }
    comments = (await response.json()).data;

    articleIds = comments.reduce((ids, currCom) => {
      ids[currCom.article.title] = currCom.articleId;
      return ids;
    }, articleIds);
  });
</script>

<Router {url}>
  <div>
    <Route path="/index.html"><RecentComments {comments} /></Route>
    {#if articleIds["article1"] === undefined}
      Loading article list...
    {:else}
      <Route path="/article1.html"
        ><Article articleId={articleIds["article1"]} /></Route
      >
      <Route path="/article2.html"
        ><Article articleId={articleIds["article2"]} /></Route
      >
    {/if}
  </div>
</Router>

<style>
  :global(h1) {
    text-align: center;
    text-transform: uppercase;
  }
</style>
