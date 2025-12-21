<script>
import "/node_modules/primeflex/primeflex.css"
import 'primeicons/primeicons.css'

export default {
  data() {
    return {
      menus: [
        { id: 'organizations', name: 'Организации' },
        { id: 'tasks', name: 'Задачи' },
        { id: 'reporting', name: 'Отчетность' }
      ]
    }
  },
  computed: {
    currentRoute() {
      return this.$route.name
    }
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName })
    }
  }
}
</script>

<template>
  <div class="flex h-screen p-2 gap-2 bg-blue-200 gradient-mask">
    <div class="w-2 p-2 gap-1 flex flex-column border-round-xl glass-effect">
      <div
          v-for="menu in menus"
          :key="menu.id"
          class="custom-hover p-3 border-round cursor-pointer text-xl hover:shadow-2"
          :class="{ 'glass-active': currentRoute === menu.id }"
          @click="navigateTo(menu.id)"
      >
        {{ menu.name }}
      </div>
    </div>

    <div class="flex-1 flex-column flex p-2 border-round-xl glass-effect">
      <router-view />
    </div>
  </div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.6);

  backdrop-filter: blur(25px) saturate(130%);
  -webkit-backdrop-filter: blur(25px) saturate(130%);

  border: 2px solid rgba(255, 255, 255, 0.2);

  box-shadow:
      0 15px 30px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-effect-dark {
  background: rgba(30, 30, 50, 0.25);

  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);

  border: 2px solid rgba(100, 150, 255, 0.2);

  box-shadow:
      0 15px 40px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.glass-active {
    background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.glass-active-dark {
  background: rgba(30, 40, 60, 0.4);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(8px);
}

.gradient-mask {
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.1) 100%,
  rgba(255, 255, 255, 0.05) 50%,
  rgba(0, 0, 0, 0.1) 100%)
}

.custom-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-hover:hover {
  /*opacity: 0.65;*/
  transform: translateY(-5px);
}
</style>
