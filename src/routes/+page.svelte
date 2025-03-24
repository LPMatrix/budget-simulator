<!-- src/routes/+page.svelte -->
<script>
  import { fly, fade } from 'svelte/transition';
  import BudgetSlider from '$lib/components/BudgetSlider.svelte';
  import ResultCard from '$lib/components/ResultCard.svelte';
  import { movieBudgetStore, weddingBudgetStore, startupBudgetStore } from '$lib/stores/budgetStore';
  import { generateMovieDescription, generateWeddingDescription, generateStartupDescription } from '$lib/api/mistral';
  
  // Tab management
  const tabs = [
    {
      id: 'movie',
      title: 'Movie Budget Splurger',
      icon: '🎬',
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-500',
      activeColor: 'bg-purple-700'
    },
    {
      id: 'wedding',
      title: 'Wedding Planner',
      icon: '💍',
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-400',
      activeColor: 'bg-pink-600'
    },
    {
      id: 'startup',
      title: 'Startup Simulator',
      icon: '🚀',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-400',
      activeColor: 'bg-blue-600'
    }
  ];
  
  let activeTab = tabs[0].id;
  
  // Budget options for each simulator
  const budgetOptions = {
    movie: [
      { value: 5000000, label: 'Indie ($5M)' },
      { value: 30000000, label: 'Mid-Budget ($30M)' },
      { value: 100000000, label: 'Blockbuster ($100M)' },
      { value: 250000000, label: 'Mega Blockbuster ($250M)' }
    ],
    wedding: [
      { value: 5000000, label: 'Budget (₦5M)' },
      { value: 15000000, label: 'Modest (₦15M)' },
      { value: 30000000, label: 'Average (₦30M)' },
      { value: 100000000, label: 'Luxury (₦100M)' }
    ],
    startup: [
      { value: 100000, label: 'Bootstrap ($100K)' },
      { value: 500000, label: 'Seed ($500K)' },
      { value: 1000000, label: 'Series A ($1M)' },
      { value: 5000000, label: 'Series B ($5M)' }
    ]
  };
  
  // Selected budget values
  let selectedBudgets = {
    movie: budgetOptions.movie[2].value,
    wedding: budgetOptions.wedding[2].value,
    startup: budgetOptions.startup[2].value
  };
  
  // Loading states
  let loading = {
    movie: false,
    wedding: false,
    startup: false
  };
  
  // Update store when budget is changed
  function handleBudgetChange(simulator) {
    if (simulator === 'movie') {
      movieBudgetStore.setTotalBudget(selectedBudgets.movie);
    } else if (simulator === 'wedding') {
      weddingBudgetStore.setTotalBudget(selectedBudgets.wedding);
    } else if (simulator === 'startup') {
      startupBudgetStore.setTotalBudget(selectedBudgets.startup);
    }
  }
  
  // Reset allocations for the current simulator
  function resetAllocations() {
    if (activeTab === 'movie') {
      movieBudgetStore.reset();
    } else if (activeTab === 'wedding') {
      weddingBudgetStore.reset();
    } else if (activeTab === 'startup') {
      startupBudgetStore.reset();
    }
  }
  
  // Generate result for the current simulator
  async function generateResult() {
    loading[activeTab] = true;
    
    try {
      let result;
      
      if (activeTab === 'movie') {
        result = await generateMovieDescription(
          $movieBudgetStore.allocations, 
          $movieBudgetStore.totalBudget
        );
        movieBudgetStore.setResult(result);
      } else if (activeTab === 'wedding') {
        result = await generateWeddingDescription(
          $weddingBudgetStore.allocations, 
          $weddingBudgetStore.totalBudget
        );
        weddingBudgetStore.setResult(result);
      } else if (activeTab === 'startup') {
        result = await generateStartupDescription(
          $startupBudgetStore.allocations, 
          $startupBudgetStore.totalBudget
        );
        startupBudgetStore.setResult(result);
      }
    } catch (error) {
      console.error('Error generating result:', error);
    } finally {
      loading[activeTab] = false;
    }
  }
  
  // Format currency based on simulator
  function formatCurrency(value, simulator) {
    if (simulator === 'movie') {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (simulator === 'wedding') {
      if (value >= 1000000) {
        return `₦${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `₦${(value / 1000).toFixed(0)}K`;
      }
      return `₦${value.toLocaleString()}`;
    } else if (simulator === 'startup') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
    }
    return `${value.toLocaleString()}`;
  }
  
  // Get current store and state based on active tab
  $: currentStore = activeTab === 'movie' 
    ? $movieBudgetStore 
    : activeTab === 'wedding' 
      ? $weddingBudgetStore 
      : $startupBudgetStore;
      
  $: currentResult = activeTab === 'movie' 
    ? $movieBudgetStore.result 
    : activeTab === 'wedding' 
      ? $weddingBudgetStore.result 
      : $startupBudgetStore.result;
  
  $: activeTabColor = tabs.find(tab => tab.id === activeTab).color;
  $: activeTabIcon = tabs.find(tab => tab.id === activeTab).icon;
</script>

<div class="min-h-screen bg-gray-100">
  <header class="bg-gray-800 shadow-md">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-white">Budget Simulator</h1>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Tabs Navigation -->
    <div class="bg-white rounded-lg shadow-md mb-8">
      <div class="flex overflow-x-auto">
        {#each tabs as tab}
          <button 
            class="flex-1 py-4 px-4 text-center font-medium transition-colors focus:outline-none {activeTab === tab.id ? tab.activeColor + ' text-white' : 'text-gray-700 ' + tab.hoverColor}"
            on:click={() => activeTab = tab.id}
          >
            <span class="flex items-center justify-center">
              <span class="text-xl mr-2">{tab.icon}</span>
              <span class="whitespace-nowrap">{tab.title}</span>
            </span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden" in:fade={{ duration: 300 }}>
      <div class="{activeTabColor} p-6 text-white">
        <h2 class="text-2xl font-bold flex items-center">
          <span class="mr-2">{activeTabIcon}</span>
          {activeTab === 'movie' 
            ? 'Budget Your Hollywood Film' 
            : activeTab === 'wedding' 
              ? 'Plan Your Dream Wedding' 
              : 'Fund Your Startup'}
        </h2>
        <p class="mt-1">
          {activeTab === 'movie' 
            ? 'Allocate your budget wisely to see what kind of movie you\'d make!' 
            : activeTab === 'wedding' 
              ? 'Allocate your budget wisely to see what kind of wedding you\'d have!' 
              : 'Allocate your funding wisely to see if your startup will thrive or dive!'}
        </p>
      </div>
      
      <div class="p-6">
        <!-- Budget Selection -->
        <div class="mb-8">
          <label class="block text-lg font-medium mb-2" for="budget-selection">
            {activeTab === 'movie' 
              ? 'Select Your Total Budget:' 
              : activeTab === 'wedding' 
                ? 'Select Your Wedding Budget:' 
                : 'Select Your Funding Round:'}
          </label>
          <div id="budget-selection" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {#each budgetOptions[activeTab] as option}
              <button 
                class="px-4 py-3 rounded-md text-center transition-colors {selectedBudgets[activeTab] === option.value ? activeTabColor + ' text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}"
                on:click={() => {
                  selectedBudgets[activeTab] = option.value;
                  handleBudgetChange(activeTab);
                }}
              >
                {option.label}
              </button>
            {/each}
          </div>
        </div>
        
        <!-- Budget Sliders -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">
              {activeTab === 'movie' 
                ? 'Allocate Your Budget' 
                : activeTab === 'wedding' 
                  ? 'Allocate Your Wedding Budget' 
                  : 'Allocate Your Funding'}
            </h3>
            <button 
              class="text-gray-700 hover:text-gray-900 transition"
              on:click={resetAllocations}
            >
              Reset Allocations
            </button>
          </div>
          
          {#each currentStore.categories as category}
            <BudgetSlider
              category={category.name}
              icon={category.icon}
              value={currentStore.allocations[category.id]}
              percentage={currentStore.percentages[category.id]}
              total={currentStore.totalBudget}
              formatValue={(val) => formatCurrency(val, activeTab)}
              formatPercentage={(pct) => `${pct.toFixed(0)}%`}
              color={activeTabColor}
              onChange={(categoryId, newValue, newPercentage) => {
                if (activeTab === 'movie') {
                  movieBudgetStore.allocate(category.id, newValue, newPercentage);
                } else if (activeTab === 'wedding') {
                  weddingBudgetStore.allocate(category.id, newValue, newPercentage);
                } else if (activeTab === 'startup') {
                  startupBudgetStore.allocate(category.id, newValue, newPercentage);
                }
              }}
            />
          {/each}
        </div>
        
        <!-- Submit Button -->
        <div class="mt-8 flex justify-center">
          <button 
            class="px-8 py-3 {activeTabColor} text-white rounded-md hover:opacity-90 transition text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={generateResult}
            disabled={loading[activeTab]}
          >
            {loading[activeTab] 
              ? 'Analyzing...' 
              : activeTab === 'movie' 
                ? 'Create My Movie!' 
                : activeTab === 'wedding' 
                  ? 'Plan My Wedding!' 
                  : 'Launch My Startup!'}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Results Section -->
    {#if currentResult || loading[activeTab]}
      <ResultCard
        result={currentResult}
        loading={loading[activeTab]}
        title={activeTab === 'movie' 
          ? 'Your Hollywood Production' 
          : activeTab === 'wedding' 
            ? 'Your Wedding Day' 
            : 'Your Startup Forecast'}
        icon={activeTabIcon}
        color={activeTabColor}
      />
    {/if}
  </main>

  <footer class="bg-white mt-12 py-6 px-4 border-t border-gray-200">
    <div class="max-w-7xl mx-auto text-center text-gray-500">
      <p>Budget Simulator | Powered by Mistral AI</p>
    </div>
  </footer>
</div>