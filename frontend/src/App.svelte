<script lang="ts">
  import RecentComments from "./lib/RecentComments.svelte";
  import { Router, Route, navigate } from "svelte-routing";
  import Article from "./lib/Article.svelte";
  import detectChangeUrl from "detect-url-change";

  import type { Comment } from "./types";
  import { onMount } from "svelte";
  let articleIds: { article1?: string; article2?: string } = {};
  let articleId1;
  let articleId2;
  let comments: Comment[];

  export let url = "";
  $: articleIds;
  $: articleId1;
  $: articleId2;

  detectChangeUrl.on("change", (newUrl) => {
    const path = new URL(newUrl).pathname;
    console.log(path);
    console.log(`URL changed to ${newUrl}`);
    console.log(newUrl);
    navigate(newUrl);
  });

  onMount(async () => {
    console.log("mount");
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
    articleId1 = articleIds["article1"];
    articleId2 = articleIds["article2"];
    console.log(articleIds);
  });
</script>

<Router {url}>
  <div>
    url: {url}
    test: {articleIds["article1"]}
    <Route path="/index.html"><RecentComments {comments} /></Route>
    <Route path="/article1.html"><Article articleId={articleId1} /></Route>
    <Route path="/article2.html"><Article articleId={articleId2} /></Route>
  </div>
</Router>

<style>
</style>
