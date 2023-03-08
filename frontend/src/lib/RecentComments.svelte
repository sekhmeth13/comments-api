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
  import { navigate } from "svelte-routing";

  dayjs.extend(relativeTime);
  export let comments: Comment[];
</script>

<div>
  <h1>Recent comments</h1>
  {#if comments === undefined}
    Loading Comments...
  {:else}
    <List class="comment-list" twoLine avatarList>
      {#each comments as comment}
        <Item on:SMUI:action={() => navigate(`/${comment.article.title}.html`)}>
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
              {dayjs(comment.createdAt).fromNow()} on {comment.article.title}
            </SecondaryText>
          </Text>
        </Item>
      {/each}
    </List>
  {/if}
</div>

<style>
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
