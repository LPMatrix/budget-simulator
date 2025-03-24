<!-- src/lib/components/ResultCard.svelte -->
<script>
    import { fly } from 'svelte/transition';
    
    export let result = '';
    export let loading = false;
    export let title = 'Your Result';
    export let icon = '🎬';
    export let color = 'bg-purple-600';
    
    // Extract quoted text from result (movie title, wedding tagline, or startup slogan)
    $: quotedText = result ? result.match(/"([^"]+)"/)?.[1] || '' : '';
    
    // Remove quoted text from main content
    $: mainContent = result ? result.replace(/"([^"]+)":\s*/, '') : '';
  </script>
  
  <div 
    class="bg-white rounded-lg shadow-lg overflow-hidden mt-8"
    in:fly={{ y: 20, duration: 400 }}
  >
    <div class="{color} p-6">
      <div class="flex justify-between items-center">
        <h3 class="text-2xl font-bold text-white">{title}</h3>
        <span class="text-4xl">{icon}</span>
      </div>
      
      {#if quotedText}
        <p class="text-xl italic font-medium text-white mt-2">"<span>{quotedText}</span>"</p>
      {/if}
    </div>
    
    <div class="p-6">
      {#if loading}
        <div class="flex flex-col items-center justify-center py-8">
          <div class="w-12 h-12 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">Analyzing your budget decisions...</p>
        </div>
      {:else if result}
        <p class="text-gray-800 text-lg leading-relaxed">{mainContent}</p>
        
        <div class="mt-6 flex justify-center">
          <button 
            class="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
            on:click={() => window.print()}
          >
            Share Result
          </button>
        </div>
      {:else}
        <p class="text-gray-600 text-center py-8">
          Allocate your budget and submit to see the results!
        </p>
      {/if}
    </div>
  </div>