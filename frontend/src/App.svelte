<script lang="ts">
  import RecentComments from "./lib/RecentComments.svelte";
  import { Router, Route, navigate } from "svelte-routing";
  import ArticleComponent from "./lib/Article.svelte";
  import detectChangeUrl from "detect-url-change";
  import type { Article } from "./types";
  import { onMount } from "svelte";

  let articleIds: { article1?: string; article2?: string } = {};
  onMount(async () => {
    const response = await fetch("http://localhost:3000/articles");
    if (!response.ok) {
      const message = await response.json();
      console.error(message);
      return;
    }
    const articles: Article[] = (await response.json()).data;
    articleIds = articles.reduce((ids, currArticle) => {
      ids[currArticle.title] = currArticle.id;
      return ids;
    }, articleIds);
  });
  export let url = "";

  detectChangeUrl.on("change", (newUrl) => navigate(newUrl));
</script>

<Router {url}>
  <div>
    <Route path="/index.html"><RecentComments /></Route>
    {#if !articleIds["article1"]}
      Loading article list...
    {:else}
      <Route path="/article1.html"
        ><ArticleComponent articleId={articleIds["article1"]} /></Route
      >
      <Route path="/article2.html"
        ><ArticleComponent articleId={articleIds["article2"]} /></Route
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
