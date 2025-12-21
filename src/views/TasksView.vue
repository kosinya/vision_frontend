<script>
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';

export default {
  name: 'TasksView',
  components: {
    Dialog,
    InputText,
    Button,
    Select
  },
  data() {
    return {
      visible: false, // видимость окна для создания задачи
      newTaskName: '',
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
      ],  
      // Список задач
      tasks: [
        {
          id: 1,
          name: 'ООО "Сетевая Безопасность"',
          createdAt: '2023-05-15',
          status: 'active'
        },
        {
          id: 2,
          name: 'ООО "Сбер"',
          createdAt: '2023-05-15',
          status: 'active'
        },
      ]
    }
  },
  methods: {
    createTask() {
      if (!this.newTaskName) return;

      const newTask = {
        id: Date.now(),
        name: this.newTaskName,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      this.tasks.push(newTask);
      
      this.newTaskName = '';
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
        :pt="{ //меняем цвет для выбранного поля (option)
          option: ({context}) => ({
            class: context.selected ? 'bg-blue-100 text-gray-800' : undefined
          })
        }"
        >

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
      <button
          @click="visible = true"
          class="pi pi-plus p-2 border-round-xl cursor-pointer bg-white border-none shadow-1 text-900"
          title="Добавить"
      ></button>
    </div>

  </div>

  <!-- Диалоговое окно для создания задачи -->
  <Dialog 
    v-model:visible="visible" 
    modal 
    header="Новая задача" 
    :style="{ width: '20rem' }"
  >
    <div class="flex flex-column gap-3">
      <InputText v-model="newTaskName" placeholder="Название задачи" class="w-full" />
      <div class="flex justify-content-end">
         <Button label="Создать" @click="createTask" />
      </div>
    </div>
  </Dialog>

  <div 
    v-for="taskItem in searchedTasks" 
    :key="taskItem.id" 
    class="flex flex-row glass-effect p-4 border-round-xl mt-2"
  >

    <!-- Информация справа -->
    <div class="flex-1">
      <!-- Заголовок и статус -->
      <div class="flex justify-content-between align-items-start mb-3">
        <div>
          <h3 class="text-xl font-bold m-0">{{ taskItem.name }}</h3>
          <div class="flex align-items-center mt-1">
            <i class="pi pi-calendar mr-2 text-sm"></i>
            <span>Создана: {{ formatDate(taskItem.createdAt) }}</span>
          </div>
        </div>
        <div class="flex align-items-center">
          <i class="pi pi-circle-fill mr-2 text-green-400"></i>
          <span class="text-sm">Активна</span>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="flex gap-2">
        <button class="p-2 border-none border-round cursor-pointer bg-blue-100">
          <i class="pi pi-pen-to-square mr-2"></i>
          <span>Редактировать</span>
        </button>
        <button class="p-2 border-none border-round cursor-pointer bg-blue-100">
          <i class="pi pi-eye mr-2"></i>
          <span>Карта дня</span>
        </button>
        <button class="p-2 border-none border-round cursor-pointer bg-blue-100">
          <i class="pi pi-chart-bar mr-2"></i>
          <span>Статистика</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>