<script lang="ts">
	let { animation = true, opacity = 0.4 }: { animation?: boolean; opacity?: number } = $props();
</script>

<div
	class="noise pointer-events-none fixed left-0 top-0 z-[1000] h-screen w-screen"
	style="opacity: {opacity};"
	class:noise-animate={animation}
></div>

<style>
	.noise {
		background: transparent url('../../assets/noise.png');
		opacity: 1;
		filter: contrast(2);
		visibility: visible;
	}

	.noise-animate {
		animation: noise__animation 0.3s infinite;
	}

	@keyframes noise__animation {
		0%,
		to {
			background-position: 0 0;
		}
		10% {
			background-position: -5% -10%;
		}
		20% {
			background-position: -15% 5%;
		}
		30% {
			background-position: 7% -25%;
		}
		40% {
			background-position: 20% 25%;
		}
		50% {
			background-position: -25% 10%;
		}
		60% {
			background-position: 15% 5%;
		}
		70% {
			background-position: 0 15%;
		}
		80% {
			background-position: 25% 35%;
		}
		90% {
			background-position: -10% 10%;
		}
	}
</style>
