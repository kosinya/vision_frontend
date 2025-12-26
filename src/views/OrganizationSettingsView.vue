<script>
import { organizationsApi } from '@/api/organizationApi.js'

export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      organization: null,
      cameras: [],
      loading: false,
      error: null,
      // Видимость диалогового окна добавления камеры
      visible: false,
      // Редактируемые поля
      editData: {
        name: '',
        address: '',
      },
    }
  },

  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.loading = true
      this.error = null
      try {
        // Загружаем организацию
        this.organization = await organizationsApi.getOrganization(this.id)
        // Загружаем камеры организации
        this.cameras = await organizationsApi.getCameras(this.id)
        console.log(this.cameras)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    redirectExternal() {
      let url = `http://192.168.8.115:9876/api/v1/organizations/${this.id}/camera-presets/create-with-canvas`
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    },

    async addCamera() {
      console.log('Добавить камеру')
    }
  }
}
</script>

<template>
  <div class="p-2">
    <!-- Заголовок -->
    <div class="mb-4">
      <h2 class="text-3xl font-bold text-surface-900 m-0">Настройки организации</h2>
      <p class="text-xl text-surface-600 mt-2">Управление информацией и камерами организации</p>

      <div v-if="error" class="p-3 mt-4 border-round-lg bg-red-100 border-1 border-red-300 text-red-700">
        <i class="pi pi-exclamation-circle mr-2"></i>
        {{ error }}
      </div>
    </div>

    <!-- Лоадер -->
    <div v-if="loading" class="flex justify-content-center p-6">
      <div class="flex flex-column align-items-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
        <p class="text-surface-500 text-lg">Загрузка данных...</p>
      </div>
    </div>

    <!-- Контент -->
    <div v-else class="flex flex-column gap-2">
      <div class="flex flex-column">
        <label class="block text-surface-700 text-lg mb-1">Название:</label>
        <input readonly class="w-20rem p-1 border-round-lg border-none text-lg shadow-2"
               placeholder="Введите название организации"
               v-model="organization.name"/>
      </div>

      <div class="flex flex-column">
        <label class="block text-surface-700 text-lg mb-1">Адрес:</label>
        <input readonly class="w-20rem p-1 border-round-lg border-none text-lg shadow-2"
               placeholder="Адрес организации"/>
      </div>

      <div class="flex flex-column">
        <label class="block text-surface-700 text-lg mb-1">Дата создания: </label>
        <input readonly class="w-20rem p-1 border-round-lg border-none text-lg shadow-2"
               placeholder="Дата создания"
               v-model="organization.created_at"/>
      </div>

      <div class="flex flex-column surface-card border-none border-round-lg p-2 shadow-2">
        <div class="flex align-items-center justify-content-between mb-2">
          <p class="text-xl font-medium m-0">Камеры</p>
          <button @click="redirectExternal()"
                  class="p-2 inline-flex align-items-center border-round-lg cursor-pointer bg-white border-none shadow-2 text-900">
            <i class="pi pi-plus mr-1"></i>
            <span>Добавить камеру</span>
          </button>
        </div>

        <div v-if="cameras.length > 0" class="flex gap-1 flex-column text-center p-4 border-2 border-dashed border-round surface-border">
          <div v-for="(cam, index) in cameras">
            <div class="flex align-items-center gap-2 py-1 px-2 border-1 surface-border border-round">
              <div class="flex p-1 border-right-1 surface-border h-full">{{ index + 1 }}</div>

              <div class="flex gap-5 p-1 h-full">
                <div class="text-xl"><b>Камера:</b> {{ cam.camera_name }}</div>
                <div class="text-xl"><b>Расположение:</b> {{ cam.location }}</div>
                <div class="text-xl"><b>Задачи:</b> {{ cam.tasks }}</div>
              </div>

              <button class="p-2 ml-auto inline-flex align-items-center border-round-lg cursor-pointer bg-white border-none shadow-2 text-900">
                <i class="pi pi-trash mr-1"></i>
                <span>Удалить</span>
              </button>

            </div>
          </div>
        </div>

        <div v-else class="text-center p-4 border-2 border-dashed border-round surface-border">
          <i class="pi pi-video text-4xl text-surface-400 mb-3"></i>
          <p class="text-surface-500 m-0">Список камер пуст</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>