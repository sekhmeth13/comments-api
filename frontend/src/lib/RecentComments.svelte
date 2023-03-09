<script lang="ts">
  import { onMount } from "svelte";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import type { Comment } from "../types";
  import CommentList from "./CommentList.svelte";
  dayjs.extend(relativeTime);
  let comments: Comment[];
  onMount(async () => {
    const response = await fetch("http://localhost:3000/comments");
    if (!response.ok) {
      const message = await response.json();
      console.error(message);
      return;
    }
    comments = (await response.json()).data;
  });
  let user: string;
</script>

<div>
  <h1>Recent comments</h1>
  {#if comments === undefined}
    Loading Comments...
  {:else}
    <CommentList {user} {comments} />
  {/if}
</div>

<style>
</style>
