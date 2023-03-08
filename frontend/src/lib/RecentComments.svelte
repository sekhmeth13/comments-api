<script lang="ts">
  import { onMount } from "svelte";
  import List, {
    Item,
    Graphic,
    Text,
    PrimaryText,
    SecondaryText,
  } from "@smui/list";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import type { Comment } from "../types";
  import { Router, Link, Route } from "svelte-routing";
  import Article from "./Article.svelte";

  dayjs.extend(relativeTime);
  let comments: Comment[];
  let articleIds: { article1: string; article2: string };

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
  export let url = "";
</script>

<Router {url}>
  <div>
    <Route path="/article1.html"
      ><Article articleId={articleIds["article1"]} /></Route
    >
    <Route path="/article2.html"
      ><Article articleId={articleIds["article2"]} /></Route
    >
  </div>
</Router>

<div>
  <h1>Recent comments</h1>
  {#if comments === undefined}
    Loading Comments...
  {:else}
    <List class="comment-list" twoLine avatarList nonInteractive>
      {#each comments as comment}
        <a href="/{comment.article.title}.html">
          <Item>
            <Graphic
              style="background-image: url(https://place-hold.it/40x40?text={comment.author.nickname.substring(
                0,
                1
              )}&fontsize=16)"
            />
            <Text style="width: 100%">
              <PrimaryText class="comment-text">{comment.content}</PrimaryText>
              <SecondaryText class="comment-infos">
                <span class="author-nickname">{comment.author.nickname}</span>
                {dayjs(comment.createdAt).fromNow()}
              </SecondaryText>
            </Text>
          </Item>
        </a>
      {/each}
    </List>
  {/if}
</div>

<style>
  h1 {
    text-align: center;
    text-transform: uppercase;
  }
  :global(.comment-infos) {
    text-align: right;
  }
  .author-nickname {
    font-weight: bold;
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
