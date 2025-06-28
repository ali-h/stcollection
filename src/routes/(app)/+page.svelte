<script lang="ts">
  import type { PageProps } from './$types';
  import Header from '$lib/components/Header.svelte';
  import Products from '$lib/components/Products.svelte';

  let { data }: PageProps = $props();
  let { products } = $derived(data);
</script>

<svelte:head>
  <title>ST Collection - Home</title>
  <meta name="description" content="Discover the latest in homegrown fashion from ST Collection, your go-to clothing brand from Rahim Yar Khan, Pakistan." />
</svelte:head>

<Header />
<Products {products} />
