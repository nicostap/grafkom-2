<script lang="ts">
    import { onMount } from "svelte";
    import { renderMain } from "./lib/main";

  onMount(() => {
    const renderTerminate = renderMain();
    return () => {
      if (renderTerminate) {
        renderTerminate();
      }
    };
  });
</script>