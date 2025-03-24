<!-- src/lib/components/BudgetSlider.svelte -->
<script>
  export let category;
  export let value;
  export let total = 100;
  export let percentage = (value / total) * 100;
  export let max = 100;
  export let min = 0;
  export let formatValue = (val) => `$${val.toLocaleString()}`;
  export let formatPercentage = (pct) => `${pct.toFixed(0)}%`;
  export let icon = '';
  export let color = 'bg-blue-500';
  export let onChange = () => {};
  
  function handleChange(event) {
    const newPercentage = parseFloat(event.target.value);
    const newValue = Math.round((newPercentage / 100) * total);
    onChange(category, newValue, newPercentage);
  }
</script>

<div class="mb-6">
  <div class="flex justify-between items-center mb-2">
    <label for="slider-{category}" class="text-lg font-medium flex items-center">
      {#if icon}
        <span class="mr-2 text-xl">{icon}</span>
      {/if}
      {category}
    </label>
    <div class="flex items-center space-x-3">
      <span class="text-xl font-bold">{formatValue(value)}</span>
      <span class="text-lg text-gray-500">{formatPercentage(percentage)}</span>
    </div>
  </div>
  
  <div class="relative">
    <input
      id="slider-{category}"
      type="range"
      min={min}
      max={max}
      step="1"
      value={percentage}
      on:input={handleChange}
      class="w-full h-3 rounded-lg appearance-none cursor-pointer"
    />
    
    <div class="w-full h-2 absolute top-0.5 left-0 rounded-lg overflow-hidden pointer-events-none">
      <div 
        class="{color} h-full" 
        style="width: {percentage}%"
      ></div>
    </div>
  </div>
</div>

<style>
  input[type="range"] {
    -webkit-appearance: none;
    background: transparent;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid #4a5568;
    cursor: pointer;
    margin-top: -9px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid #4a5568;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  input[type="range"]::-webkit-slider-runnable-track {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
  }
  
  input[type="range"]::-moz-range-track {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
  }
</style>