<template>
  <div class="flex flex-column gap-4 overflow-y-auto p-2">
    <!-- Заголовок и основная информация -->
    <div class="flex flex-column gap-2 md:flex-row justify-content-end align-items-start">
      <div class="mb-3 md:mb-0">
        <h2 class="text-3xl font-bold mb-2 text-gray-900">Задача видеоаналитики</h2>
        <div class="flex flex-column md:flex-row gap-3">
          <div>
            <div class="text-xl text-gray-600">Дата создания задачи:</div>
            <div class="text-xl font-semibold text-gray-900">{{ formatDate(task.created_at) }}</div>
          </div>
          <div>
            <div class="text-xl text-gray-600">Организация:</div>
            <div class="text-xl font-semibold text-gray-900">{{ task.organization_id }}</div>
          </div>
        </div>
      </div>

      <!-- Кнопка загрузки -->
      <button @click="openUploadDialog"
              class="flex ml-auto align-items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium py-2 px-4
              border-round-sm border-none cursor-pointer transition-colors duration-200">
        <i class="pi pi-upload"></i>
        <span>Загрузить карту дня</span>
      </button>

      <button @click="openUploadDialog"
              class="flex align-items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium py-2 px-4
              border-round-sm border-none cursor-pointer transition-colors duration-200">
        <i class="pi pi-upload"></i>
        <span>Загрузить папку с видео</span>
      </button>
    </div>

    <!-- Список видео -->
    <div class="flex flex-column gap-2 bg-white border-1 border-gray-200 rounded-lg p-4">
      <div class="flex justify-content-between align-items-center">
        <h3 class="text-xl font-semibold m-0 text-gray-900">Видеофайлы</h3>
        <span class="text-lg text-gray-900">Всего: {{ videos.length }}</span>
      </div>

      <!-- Фильтры статуса -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button
            v-for="status in statuses"
            :key="status.value"
            @click="activeStatus = status.value"
            class="px-3 py-1 text-sm rounded-full border-1 border-gray-200 transition-all duration-200 cursor-pointer"
            :class="{
            'bg-blue-100 border-blue-300 text-blue-900': activeStatus === status.value,
            'bg-gray-100 text-gray-900 hover:bg-gray-200': activeStatus !== status.value
          }"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- Таблица видео -->
      <div class="overflow-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="text-left py-3 px-2 text-lg text-gray-900">
              <th>Название</th>
              <th>Длительность</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
          <tr
              v-for="video in paginatedVideos"
              :key="video.id"
              class="hover:bg-gray-100 transition-colors"
              :class="{ 'bg-blue-50': selectedVideo?.id === video.id }"
              @click="selectVideo(video)"
          >
            <td class="py-3 px-2 text-lg">
              <div class="flex align-items-center">
                <i class="pi pi-video mr-2 text-gray-900"></i>
                <span>{{ video.name }}</span>
              </div>
            </td>
            <td class="py-3 px-2 text-lg">
              <span>{{ formatDuration(video.duration) }}</span>
            </td>
            <td class="py-3 px-2 text-lg">
                <span
                    class="inline-block px-2 py-1 rounded-full"
                    :class="getStatusClass(video.status)"
                >
                  {{ getStatusLabel(video.status) }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Пагинация -->
        <div v-if="totalPages > 1" class="flex justify-content-between align-items-center mt-4 pt-3 border-t-1 border-gray-200">
          <span class="text-lg">
            Показано {{ startIndex + 1 }}-{{ endIndex }} из {{ filteredVideos.length }}
          </span>
          <div class="flex gap-1">
            <button @click="prevPage"
                    :disabled="currentPage === 1"
                    class="flex p-1 align-items-center justify-content-center border-1 border-gray-300 rounded
                    hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="pi pi-chevron-left"></i>
            </button>
            <button v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    class="flex p-1 align-items-center justify-content-center border-1 rounded"
                    :class="{
                      'border-blue-500 bg-blue-500 text-white': currentPage === page,
                      'border-gray-300 hover:bg-gray-100': currentPage !== page
                    }">
              {{ page }}
            </button>
            <button @click="nextPage"
                    :disabled="currentPage === totalPages" class="flex p-1 align-items-center justify-content-center
                    border-1 border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Видеоплееры -->
    <div class="bg-white border-1 border-gray-200 rounded-lg p-4">
      <h3 class="text-xl font-semibold mb-4 text-gray-900">Видеоплееры</h3>
      <div class="flex flex-column gap-4 h-screen">
        <!-- Первый ряд (2 плеера) -->
        <div class="flex gap-4" style="height: 50%;">
          <div v-for="index in [0, 1]"
               :key="index"
               class="border-1 border-gray-200 rounded-lg overflow-hidden w-6">
              <div class="flex justify-content-between align-items-center p-3 bg-gray-50 border-b-1 border-gray-200">
              <span class="font-medium text-gray-900">Камера {{ index + 1 }}</span>
              <span class="px-2 py-1 text-xs rounded-full"
                    :class="{'bg-green-100 text-green-800': players[index].isActive,
                    'bg-gray-100 text-gray-600': !players[index].isActive}">
                {{ players[index].status }}
              </span>
            </div>

            <!-- Контейнер для видеоплеера -->
            <div class="relative w-full" style="height: calc(100% - 48px);">
              <video
                  v-if="players[index].source"
                  :ref="'videoPlayer' + index"
                  controls
                  class="absolute w-full h-full object-contain bg-black"
                  preload="metadata"
              >
                <source :src="players[index].source" type="application/x-mpegURL">
                Ваш браузер не поддерживает видео.
              </video>
              <div v-else class="absolute w-full h-full flex align-items-center justify-content-center bg-gray-100">
                <div class="text-center">
                  <i class="pi pi-video text-4xl text-gray-400 mb-2"></i>
                  <p class="text-sm text-gray-500">Нет видеопотока</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Первый ряд (2 плеера) -->
        <div class="flex gap-4" style="height: 50%;">
          <div v-for="index in [0, 1]"
               :key="index"
               class="border-1 border-gray-200 rounded-lg overflow-hidden w-6">
            <div class="flex justify-content-between align-items-center p-3 bg-gray-50 border-b-1 border-gray-200">
              <span class="font-medium text-gray-900">Камера {{ index + 1 }}</span>
              <span class="px-2 py-1 text-xs rounded-full"
                    :class="{'bg-green-100 text-green-800': players[index].isActive,
                    'bg-gray-100 text-gray-600': !players[index].isActive}">
                {{ players[index].status }}
              </span>
            </div>

            <!-- Контейнер для видеоплеера -->
            <div class="relative w-full" style="height: calc(100% - 48px);">
              <video
                  v-if="players[index].source"
                  :ref="'videoPlayer' + index"
                  controls
                  class="absolute w-full h-full object-contain bg-black"
                  preload="metadata"
              >
                <source :src="players[index].source" type="application/x-mpegURL">
                Ваш браузер не поддерживает видео.
              </video>
              <div v-else class="absolute w-full h-full flex align-items-center justify-content-center bg-gray-100">
                <div class="text-center">
                  <i class="pi pi-video text-4xl text-gray-400 mb-2"></i>
                  <p class="text-sm text-gray-500">Нет видеопотока</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Диалог загрузки файла -->
    <dialog v-if="showUploadDialog"
            class="flex flex-column gap-2 p-3 border-1 border-gray-400"
            click.self="closeDialog">
      <h3 class="text-lg font-semibold m-0 text-gray-900">Загрузка файла</h3>

      <div class="flex flex-column">
        <label class="block text-sm font-medium text-gray-700 mb-2">Файл Excel</label>
        <div @click="triggerFileInput"
             class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer
             hover:border-blue-400 transition-colors duration-200">
          <i class="pi pi-file-excel text-3xl text-green-600 mb-2"></i>
          <p class="text-gray-700 mb-1">
            {{ selectedFileName }}
          </p>
          <p class="text-gray-600">Поддерживаемые форматы: .xlsx, .xls</p>
        </div>
        <input type="file"
               ref="dialogFileInput"
               @change="handleFileSelect"
               accept=".xlsx,.xls"
               class="hidden"/>
      </div>

      <div class="flex justify-content-start gap-2">
        <button @click="closeDialog"
                class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded border-1 border-gray-300 transition-colors
                duration-200">
          Отмена
        </button>
        <button @click="processUpload"
                :disabled="!selectedFile"
                class="px-4 py-2 bg-blue-500 text-white rounded border-none hover:bg-blue-600 disabled:opacity-50
                disabled:cursor-not-allowed transition-colors duration-200">
          {{ isUploading ? 'Загрузка...' : 'Загрузить' }}
        </button>
      </div>
    </dialog>
  </div>
</template>

<script>
import {taskApi} from "@/api/taskApi.js";

export default {
  name: 'TaskSettingsView',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      task: {},
      players: [
        {
          id: 1,
          source: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
          status: 'Активно',
          isActive: true
        },
        {
          id: 2,
          source: '',
          status: 'Офлайн',
          isActive: false
        },
        {
          id: 3,
          source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          status: 'Активно',
          isActive: true
        },
        {
          id: 4,
          source: '',
          status: 'Офлайн',
          isActive: false
        }
      ],
      videos: [
        { id: 1, name: 'parking_entrance_1.mp4', duration: 300, status: 'active', videoDuration: '00:05:00' },
        { id: 2, name: 'main_hall_camera.mp4', duration: 600, status: 'queued', videoDuration: '00:10:00' },
        { id: 3, name: 'loading_zone.mp4', duration: 450, status: 'completed', videoDuration: '00:07:30' },
        { id: 5, name: 'entrance_gate.mp4', duration: 180, status: 'active', videoDuration: '00:03:00' },
        { id: 6, name: 'warehouse_aisle.mp4', duration: 900, status: 'queued', videoDuration: '00:15:00' },
        { id: 7, name: 'office_lobby.mp4', duration: 300, status: 'completed', videoDuration: '00:05:00' },
        { id: 9, name: 'roof_camera.mp4', duration: 500, status: 'active', videoDuration: '00:08:20' },
        { id: 10, name: 'reception_area.mp4', duration: 400, status: 'queued', videoDuration: '00:06:40' }
      ],
      statuses: [
        { label: 'Все', value: 'all', color: '#6366F1' },
        { label: 'Активно', value: 'active', color: '#10B981' },
        { label: 'В очереди', value: 'queued', color: '#F59E0B' },
        { label: 'Завершено', value: 'completed', color: '#3B82F6' },
      ],
      selectedVideo: null,
      activeStatus: 'all',
      showUploadDialog: false,
      selectedFile: null,
      isUploading: false,
      showNotification: false,
      currentPage: 1,
      pageSize: 5
    }
  },

  async created() {
    this.task = await taskApi.getTask(this.id);
    console.log(this.task);
  },

  computed: {
    filteredVideos() {
      if (this.activeStatus === 'all') {
        return this.videos
      }
      return this.videos.filter(video => video.status === this.activeStatus)
    },

    totalPages() {
      return Math.ceil(this.filteredVideos.length / this.pageSize)
    },

    startIndex() {
      return (this.currentPage - 1) * this.pageSize
    },

    endIndex() {
      const end = this.startIndex + this.pageSize
      return Math.min(end, this.filteredVideos.length)
    },

    paginatedVideos() {
      return this.filteredVideos.slice(this.startIndex, this.endIndex)
    },

    visiblePages() {
      const pages = []
      const maxVisible = 3
      let start = Math.max(1, this.currentPage - 1)
      let end = Math.min(this.totalPages, start + maxVisible - 1)

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },

    selectedFileName() {
      return this.selectedFile ? this.selectedFile.name : 'Нажмите для выбора файла'
    }
  },

  methods: {
    // Форматирование данных
    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    getStatusLabel(status) {
      const map = {
        'active': 'Активно',
        'queued': 'В очереди',
        'completed': 'Завершено',
      }
      return map[status] || status
    },

    getStatusClass(status) {
      const map = {
        'active': 'bg-green-100 text-green-900',
        'queued': 'bg-yellow-100 text-yellow-900',
        'completed': 'bg-blue-100 text-blue-900',
      }
      return map[status] || 'bg-gray-100 text-gray-900'
    },

    // Работа с видео
    selectVideo(video) {
      this.selectedVideo = video
    },

    // Пагинация
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    goToPage(page) {
      this.currentPage = page
    },

    // Диалог загрузки файлов
    openUploadDialog() {
      this.showUploadDialog = true
      this.selectedFile = null
    },

    triggerFileInput() {
      this.$refs.dialogFileInput?.click()
    },

    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file && this.validateExcelFile(file)) {
        this.selectedFile = file
      } else {
        this.showError('Пожалуйста, выберите файл Excel (.xlsx, .xls)')
      }
    },

    validateExcelFile(file) {
      const allowedExtensions = ['.xlsx', '.xls']
      const fileName = file.name.toLowerCase()
      return allowedExtensions.some(ext => fileName.endsWith(ext))
    },

    async processUpload() {
      if (!this.selectedFile) return

      this.isUploading = true

      // Имитация загрузки
      setTimeout(() => {
        this.isUploading = false
        this.showUploadDialog = false

        // Показываем уведомление
        this.showSuccessNotification()

        // Добавляем новое видео в список
        const newId = Math.max(...this.videos.map(v => v.id)) + 1
        const durations = ['00:03:15', '00:04:30', '00:07:45', '00:12:20', '00:05:50']
        const randomDuration = durations[Math.floor(Math.random() * durations.length)]

        this.videos.unshift({
          id: newId,
          name: this.selectedFile.name,
          duration: Math.floor(Math.random() * 600) + 60,
          status: 'queued',
          videoDuration: randomDuration
        })

        // Сбрасываем выбранную страницу для пагинации
        this.currentPage = 1

        // Очищаем файл
        this.selectedFile = null
        if (this.$refs.dialogFileInput) this.$refs.dialogFileInput.value = ''
      }, 1500)
    },

    closeDialog() {
      this.showUploadDialog = false
      this.selectedFile = null
      if (this.$refs.dialogFileInput) this.$refs.dialogFileInput.value = ''
    },

    // Уведомления
    showSuccessNotification() {
      this.showNotification = true
      setTimeout(() => {
        this.showNotification = false
      }, 3000)
    },

    hideNotification() {
      this.showNotification = false
    },

    showError(message) {
      // Здесь можно добавить отображение ошибки
      console.error(message)
    },

    // Инициализация видеоплееров
    initializeVideoPlayers() {
      this.players.forEach((player, index) => {
        const videoElement = this.$refs['videoPlayer' + index]
        if (videoElement && player.source) {
          videoElement.addEventListener('error', (e) => {
            console.error(`Ошибка в плеере ${index + 1}:`, e)
          })
        }
      })
    }
  },

  mounted() {
    // Инициализация видеоплееров
    this.$nextTick(() => {
      this.initializeVideoPlayers()
    })
  },

  watch: {
    activeStatus() {
      // Сбрасываем на первую страницу при изменении фильтра
      this.currentPage = 1
    }
  }
}
</script>

<style>
@keyframes fadein {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadein {
  animation: fadein 0.3s ease-out;
}

.hidden {
  display: none;
}

.z-50 {
  z-index: 50;
}

.grid-nogutter {
  margin: 0;
}
</style>