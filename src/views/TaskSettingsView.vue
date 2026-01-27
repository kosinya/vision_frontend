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
              class="flex ml-auto align-items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4
              border-round-sm border-none cursor-pointer transition-colors duration-200">
        <i class="pi pi-upload"></i>
        <span>Загрузить карту дня</span>
      </button>

      <button @click="showVideoFolderUpload = true"
              class="flex align-items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sn font-medium py-2 px-4
              border-round-sm border-none cursor-pointer transition-colors duration-200">
        <i class="pi pi-upload"></i>
        <span>Загрузить папку с видео</span>
      </button>

      <button @click="showVideoFolderUpload = true"
              class="flex align-items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sn font-medium py-2 px-4
              border-round-sm border-none cursor-pointer transition-colors duration-200">
        <i class="pi pi-upload"></i>
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
              <th>Действия</th>
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
                <span>{{ video.title }}</span>
              </div>
            </td>
            <td class="py-3 px-2 text-lg">
              <span>Нет данных</span>
            </td>
            <td class="py-3 px-2 text-lg">
                <span
                    class="inline-block px-2 py-1 rounded-full"
                    :class="getStatusClass(video.status)"
                >
                  {{ getStatusLabel(video.status) }}
                </span>
            </td>
            <td>
              <button class="flex align-items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sn font-medium py-2 px-4
                border-round-sm border-none cursor-pointer transition-colors duration-200"
                      @click="this.show(video.id)">
                Показать
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <button class="flex align-items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sn font-medium py-2 px-4
                border-round-sm border-none cursor-pointer transition-colors duration-200"
                @click="addVideosToQueue">
          Поставить видео в очередь на обработку
        </button>

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
    <div class="bg-white border-1 border-gray-200 rounded-lg p-4 w-full">
      <h3 class="text-xl font-semibold mb-4 text-gray-900">Видеоплееры</h3>
      <div class="flex justify-content-center w-full">
        <div class="border-1 border-gray-200 rounded-lg w-full max-w-4xl">
          <div class="flex justify-content-between align-items-center p-3 bg-gray-50 border-b-1 border-gray-200">
            <span class="font-medium text-gray-900">Камера 1</span>
            <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          Активно
        </span>
          </div>

          <!-- Контейнер для видеоплеера -->
          <div class="relative w-full" style="aspect-ratio: 16/9;">
            <video
                id="video"
                ref="videoElement"
                controls
                autoplay
                class="w-full h-full border-round"
            ></video>
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

    <dialog v-if="showVideoFolderUpload"
            class="flex flex-column gap-4 p-4 border-1 border-gray-400 bg-white rounded-lg shadow-lg"
            style="width: 400px; max-width: 90vw;"
            @click.self="closeDialog">
      <h3 class="text-lg font-semibold m-0 text-gray-900">Путь папки с видео</h3>

      <div class="flex flex-column gap-3">
        <input class="p-1" v-model:="this.rootPath">
      </div>

      <div class="flex justify-content-end gap-2 mt-2">
        <button @click="closeFileDialog"
                class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded border-1 border-gray-300 transition-colors
            duration-200">
          Отмена
        </button>
        <button @click="confirmFolderSelection"
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
import Hls from 'hls.js'

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
      streamUrl: "",
      task: {},
      players: {
        id: 1,
        source: 'http://localhost:9876/hls/live/4c3672c6-ecff-4cf4-8e29-f0aedaca3bfe.m3u8',
        status: 'Активно',
        isActive: true
      },
      videos: [],
      statuses: [
        { label: 'Все', value: 'all', color: '#6366F1' },
        { label: 'Активно', value: 'active', color: '#10B981' },
        { label: 'В очереди', value: 'queued', color: '#F59E0B' },
        { label: 'Завершено', value: 'completed', color: '#3B82F6' },
      ],
      selectedVideo: null,
      activeStatus: 'all',
      showUploadDialog: false,
      showVideoFolderUpload: false,
      selectedFile: null,
      isUploading: false,
      showNotification: false,
      currentPage: 1,
      pageSize: 5,
      rootPath: "",
      refreshInterval: null
    }
  },

  async created() {
    this.task = await taskApi.getTask(this.id);
    this.videos = await taskApi.getVideos(this.id);
    console.log(this.task);
    console.log(this.videos);
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
    show(id) {
      taskApi.getHls(id).then((res) => {
        this.streamUrl = res["hls_url"].replace("/live", "").replace(".m3u8", "/index.m3u8")
        console.log(this.streamUrl)
      })
      // taskApi.getHlsHTML(id).then(html => {
      //   console.log(html)
      // })
    },

    loadStream() {
      const video = document.getElementById('video');

      if (!video) return

      if (this.hls) {
        this.hls.destroy()
      }

      if (Hls.isSupported()) {
        console.log("Поддерживается")
        this.hls = new Hls({ lowLatencyMode: true })
        this.hls.loadSource(this.streamUrl)
        this.hls.attachMedia(video)

        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => console.log('media attached'));
        this.hls.on(Hls.Events.ERROR, (e, data) => console.warn('HLS error', data));
      } else if (video.canPlayType('application/vnd.apple.mpegURL')) {
        video.src = this.streamUrl;
      } else {
        document.body.insertAdjacentHTML('beforeend', '<p>Ваш браузер не поддерживает HLS</p>');
      }
    },

    destroyPlayer() {
      if (this.hls) {
        this.hls.destroy()
      }
    },

    reloadStream() {
      this.destroyPlayer()
      this.loadStream()
    },

    async loadVideos() {
      try {
        this.videos = await taskApi.getVideos(this.id);
      } catch (error) {
        console.error('Ошибка загрузки видео:', error);
      }
    },

    async addVideosToQueue() {
      await taskApi.enqueueVideo(this.id)
    },

    selectFolder() {
      this.$refs.folderInput?.click()
    },

    confirmFolderSelection() {
      if (this.rootPath) {
        this.isUploading = true
        // Имитация загрузки
        setTimeout(() => {
          this.isUploading = false
          this.showVideoFolderUpload = false

          let data = {
            "root_path": this.rootPath,
            "recursive": true
          }
          taskApi.scanVideo(this.id, data)
        }, 10)
        console.log(this.rootPath)
      }
    },

    closeFileDialog() {
      this.showVideoFolderUpload = false
      // Очищаем инпут при закрытии
      if (this.$refs.folderInput) {
        this.$refs.folderInput.value = ''
      }
    },
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
  },
  mounted() {
    this.loadVideos();
    this.refreshInterval = setInterval(() => {
      this.loadVideos();
    }, 5000);
  },

  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },

  watch: {
    activeStatus() {
      // Сбрасываем на первую страницу при изменении фильтра
      this.currentPage = 1
    },

    streamUrl() {
      this.reloadStream()
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