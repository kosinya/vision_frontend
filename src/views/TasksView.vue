<script>
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import {taskApi} from "@/api/taskApi.js";
import {organizationsStore} from "@/stores/organizationsStore.js";
import {organizationsApi} from "@/api/organizationApi.js";

export default {
  name: 'TasksView',
  components: {
    Dialog,
    InputText,
    Button,
    Select
  },
  setup() {
    const store = organizationsStore()
    return { store }
  },
  data() {
    return {
      selectedOrganization: null,
      tasks: [],
      newTask: {
        title: "",
        description: "",
      },
      visible: false, // видимость окна для создания задачи
      search: '', // Поисковой запрос пользователя
      selectedStatus: '', // Опция фильтра
      statuses: [
        {
          label: 'Все',
          value: 'null'
        },
        {
          label: 'По алфавиту',
          value: 'alpha'          
        },
        {
          label: 'По дате',
          value: 'date'          
        }, 
        {
          label: 'По активности',
          value: 'active'          
        }       
      ]
    }
  },

  methods: {
    getReport(id) {
      taskApi.getReport(id).then(response => {
        console.log(response.data);
        const blob = new Blob([response], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        const filename = `report.txt`
        link.setAttribute('download', filename)

        document.body.appendChild(link)
        link.click()

        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
      })
    },

    async loadTasks() {
      this.loading = true
      this.error = null
      try {
        this.tasks = await taskApi.getTasks()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    createTask() {
      if (!this.newTask.title) return;

      taskApi.createTask(this.newTask, this.selectedOrganization.id).then(response => {
        this.loadTasks();
      });
      
      this.newTask.title = this.newTask.description = "";
      this.visible = false;

    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  },
  computed: {
    organizationsApi() {
      return organizationsApi
    },
    searchedTasks() {
      let result = this.tasks;

      // Если в поле поиска что-то написано, фильтруем список
      if (this.search) {
        result = result.filter(item =>
          item.name.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      // Проверяем, что выбрано в selectedStatus
      // Сортировка по алфавиту
      if (this.selectedStatus === 'alpha') {
        // [...result] создает копию массива, чтобы не ломать исходный порядок
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      }

      // Сортировка по дате
      if (this.selectedStatus === 'date') {
        return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // а и b - 2 сравниваемых аэлемента массива
      }

      // Фильтрация по статусу "Активна"
      if (this.selectedStatus === 'active') {
        return result.filter(org => org.status === 'active');
      }

      // Если выбрано "Все" или ничего не выбрано, возвращаем результат поиска
      return result;
    }
  },
  async created() {
    await this.loadTasks();
  }
}
</script>

<template>
  <div class="flex gap-2">
    <div class="flex w-full">
      <input-text v-model="search" class="w-full border-0 border-round-xl" placeholder="Введите данные для поиска..."></input-text>
    </div>

    <button class="p-2 inline-flex align-items-center border-round-xl cursor-pointer bg-white border-none shadow-1 text-900">
      <i class="pi pi-search mr-1"></i>
      <span>Поиск</span>
    </button>

    <Select v-model="selectedStatus" 
            :options="statuses"
            optionLabel="label"
            optionValue="value"
            placeholder="Фильтры"
            class="inline-flex align-items-center border-round-xl cursor-pointer bg-white border-none shadow-1 text-900"
            :pt="{ option: ({context}) => ({ class: context.selected ? 'bg-blue-100 text-gray-800' : undefined })}">
      <template #value="slotName"> <!-- записываем #value (value нашего слота) в slotName"-->
          <div v-if="slotName.value && slotName.value !== 'null'" class="flex align-items-center">
              <i class="pi pi-filter-fill mr-2 text-gray-500"></i>
              <span>{{ statuses.find(s => s.value === slotName.value)?.label }}</span> <!-- отображаем label соответствующего value -->
          </div>
          <div v-else class="flex align-items-center">
              <i class="pi pi-filter mr-2"></i>
              <span>Фильтры</span>
          </div>
      </template>
    </Select>

    <!-- Кнопка для добавления задачи -->
    <div class="flex justify-content-end">
      <button @click="visible = true"
              class="pi pi-plus p-2 border-round-xl cursor-pointer bg-white border-none shadow-1 text-900"
              title="Добавить">
      </button>
    </div>
  </div>

  <!-- Диалоговое окно для создания задачи -->
  <Dialog v-model:visible="visible" modal header="Создание новой задачи" :style="{ width: '20rem' }">
    <div class="flex flex-column gap-3">
      <InputText v-model="newTask.title" placeholder="Название задачи" class="w-full" />
      <InputText v-model="newTask.description" placeholder="Описание задачи" class="w-full" />
      <Select v-model="selectedOrganization" :options="this.store.getOrganizations" optionLabel="name"
              placeholder="Организация">

      </Select>
      <div class="flex justify-content-end">
         <Button label="Создать" @click="createTask" />
      </div>
    </div>
  </Dialog>

  <div v-for="taskItem in searchedTasks"
       :key="taskItem.id"
       class="flex flex-row glass-effect p-4 border-round-xl mt-2">

    <!-- Информация справа -->
    <div class="flex-1">
      <!-- Заголовок и статус -->
      <div class="flex justify-content-between align-items-start mb-3">
        <div>
          <h3 class="text-xl font-bold m-0">{{ taskItem.title }}</h3>
          <div class="flex align-items-center mt-1">
            <i class="pi pi-calendar mr-2 text-sm"></i>
            <span>Создана: {{ formatDate(taskItem.created_at) }}</span>
          </div>
        </div>
        <div class="flex flex-column align-items-end">
          <span class="text-sm">Организация:</span>
          <span class="text-sm">{{ taskItem.organization_id }}</span>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="flex gap-2">
        <button class="p-2 border-none border-round cursor-pointer bg-blue-100"
                @click="this.$router.push({ name: 'task-setting', params: { id: taskItem.id } })">
          <i class="pi pi-pen-to-square mr-2"></i>
          <span>Перейти к задаче</span>
        </button>
        <button class="p-2 border-none border-round cursor-pointer bg-blue-100">
          <i class="pi pi-eye mr-2"></i>
          <span>Карта дня</span>
        </button>
        <button class="p-2 border-none border-round cursor-pointer bg-blue-100"
                @click="this.getReport(taskItem.id)">
          <i class="pi pi-chart-bar mr-2"></i>
          <span>Отчет</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>