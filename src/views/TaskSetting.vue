<script>
export default {
  data() {
    return {
      videos: [
        { name: 'camera1_20241210.mp4', size: 102400000, duration: 3600, date: '2024-12-10' },
        { name: 'camera2_20241210.mp4', size: 204800000, duration: 7200, date: '2024-12-10' }
      ]
    }
  },
  methods: {
    formatSize(bytes) {
      const mb = bytes / (1024 * 1024)
      return `${mb.toFixed(1)} MB`
    },
    formatDuration(seconds) {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}ч ${minutes}м`
    }
  }
}
</script>

<template>
  <div class="p-4">
    <!-- Заголовок -->
    <div class="mb-5">
      <h2 class="text-2xl font-bold text-surface-900">Новая задача анализа</h2>
      <p class="text-surface-600 mt-1">Настройте параметры анализа видеозаписей</p>
    </div>

    <!-- Форма задачи -->
    <div class="grid">
      <!-- Левая колонка - Основные настройки -->
      <div class="col-12 md:col-6 lg:col-8">
        <Card class="mb-4">
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-info-circle mr-2 text-primary"></i>
              <span>Описание задачи</span>
            </div>
          </template>
          <template #content>
            <div class="field">
              <label class="block text-surface-700 font-medium mb-2">Название задачи</label>
              <InputText class="w-full" placeholder="Введите название" />
            </div>

            <div class="field mt-3">
              <label class="block text-surface-700 font-medium mb-2">Описание</label>
              <Textarea class="w-full" rows="4" placeholder="Опишите задачу анализа..." />
            </div>
          </template>
        </Card>

        <!-- Выбор папки с видео -->
        <Card class="mb-4">
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-folder mr-2 text-primary"></i>
              <span>Папка с видео для анализа</span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div class="field">
                <label class="block text-surface-700 font-medium mb-2">Путь к папке</label>
                <div class="flex gap-2">
                  <InputText class="flex-1" placeholder="C:\videos\camera1\" />
                  <Button label="Выбрать" icon="pi pi-folder-open" severity="secondary" />
                </div>
              </div>

              <div class="field">
                <label class="block text-surface-700 font-medium mb-2">Загрузить файлы</label>
                <FileUpload
                    mode="basic"
                    name="demo[]"
                    :multiple="true"
                    accept="video/*"
                    :maxFileSize="1000000000"
                    chooseLabel="Выбрать видеофайлы"
                    class="w-full"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Правая колонка - Дополнительные настройки -->
      <div class="col-12 md:col-6 lg:col-4">
        <Card class="mb-4">
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-calendar mr-2 text-primary"></i>
              <span>Карта дня</span>
            </div>
          </template>
          <template #content>
            <div class="text-center">
              <Button
                  label="Открыть карту дня"
                  icon="pi pi-map"
                  class="w-full mb-3"
                  severity="help"
              />
              <p class="text-sm text-surface-500">Настройте временные интервалы для анализа</p>
            </div>
          </template>
        </Card>

        <!-- Действия -->
        <Card>
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-play mr-2 text-primary"></i>
              <span>Запуск анализа</span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-2">
              <Button
                  label="Начать анализ"
                  icon="pi pi-play"
                  class="w-full"
                  severity="success"
              />
              <Button
                  label="Сохранить задачу"
                  icon="pi pi-save"
                  class="w-full"
                  severity="secondary"
              />
              <Button
                  label="Отмена"
                  icon="pi pi-times"
                  class="w-full p-button-outlined"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Список загруженных видео -->
    <Card class="mt-4">
      <template #title>
        <div class="flex align-items-center">
          <i class="pi pi-video mr-2 text-primary"></i>
          <span>Загруженные видеофайлы</span>
          <Badge :value="videos.length" class="ml-2" severity="info" />
        </div>
      </template>
      <template #content>
        <DataTable
            :value="videos"
            class="p-datatable-sm"
            :paginator="true"
            :rows="5"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate="Показано {first} - {last} из {totalRecords}"
        >
          <Column field="name" header="Название файла" sortable></Column>
          <Column field="size" header="Размер" sortable>
            <template #body="{data}">
              {{ formatSize(data.size) }}
            </template>
          </Column>
          <Column field="duration" header="Длительность" sortable>
            <template #body="{data}">
              {{ formatDuration(data.duration) }}
            </template>
          </Column>
          <Column field="date" header="Дата" sortable></Column>
          <Column header="Действия">
            <template #body>
              <div class="flex gap-1">
                <Button icon="pi pi-play" class="p-button-sm p-button-rounded p-button-text" />
                <Button icon="pi pi-trash" class="p-button-sm p-button-rounded p-button-text p-button-danger" />
              </div>
            </template>
          </Column>
        </DataTable>

        <div v-if="videos.length === 0" class="text-center p-4">
          <i class="pi pi-inbox text-4xl text-surface-300 mb-3"></i>
          <p class="text-surface-500">Нет загруженных видеофайлов</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>