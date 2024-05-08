<script lang="ts">
    import { onMount } from "svelte";
    import { renderMain } from "./lib/main";

  onMount(() => {
    renderMain();
  });
</script>