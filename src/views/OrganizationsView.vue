<script>
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';

import { organizationsApi } from '@/api/organizationApi.js'
import { organizationsStore } from "@/stores/organizationsStore.js";

export default {
  name: 'OrganizationsView',
  components: {
    Dialog,
    InputText,
    Button,
    Select,
  },
  setup() {
    const store = organizationsStore()
    store.loadOrganizations()
    return { store }
  },
  data() {
    return {
      organizations: [],
      visible: false, // Видимость диалогового окна
      newOrgName: '', // Название новой организации
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
    async addOrganization() {
      try {
        organizationsApi.createOrganization({
          name: this.newOrgName,
        }).then(response => {
          // TODO: Реализовать через мутацию
          this.store.loadOrganizations()
        })
      } catch (err) {
        this.error = err.message
      }
      this.newOrgName = ''
      this.visible = false
    },

    // async deleteOrganization(id) {
    //   try {
    //     await organizationsApi.deleteOrganization(id)
    //     this.organizations = this.organizations.filter(org => org.id !== id)
    //   } catch (err) {
    //     this.error = err.message
    //   }
    // },

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
    searchedOrganizations() {
      let result = this.store.organizations;
      if (this.search) {
        result = result.filter(item =>
          item.name.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      // Сортировка по алфавиту
      if (this.selectedStatus === 'alpha') {
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      }
      // Сортировка по дате
      if (this.selectedStatus === 'date') {
        return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
      <input-text v-model="search" class="w-full border-0 border-round-xl text-xl"
                  placeholder="Введите данные для поиска..."></input-text>
    </div>

    <button class="p-2 inline-flex align-items-center border-round-xl cursor-pointer bg-white border-none
                   shadow-1 text-900 text-lg">
      <i class="text-lg pi pi-search mr-2"></i>
      <span>Поиск</span>
    </button>

    <Select v-model="selectedStatus" :options="statuses" optionLabel="label" optionValue="value"
            placeholder="Фильтры"
            class="inline-flex align-items-center border-round-xl cursor-pointer bg-white border-none shadow-1 text-900 text-xl"
            :pt="{ option: ({context}) => ({class: context.selected ? 'bg-blue-100 text-gray-800' : undefined}) }">
      <template #value="slotName">
        <div v-if="slotName.value && slotName.value !== 'null'" class="flex align-items-center text-xl">
            <i class="pi pi-filter-fill mr-2 text-gray-500 text-xl"></i>
            <span>{{ statuses.find(s => s.value === slotName.value)?.label }}</span>
        </div>

        <div v-else class="flex align-items-center text-xl">
            <i class="text-xl pi pi-filter mr-2"></i>
            <span>Фильтры</span>
        </div>
      </template>
    </Select>

    <!-- Кнопка для добавления организации -->
    <div class="flex justify-content-end">
      <button @click="visible = true"
              class="p-2 border-round-xl cursor-pointer bg-white border-none shadow-1 text-900 text-lg"
              title="Добавить организацию">
        Добавить
      </button>
    </div>

  </div>

  <!-- Диалоговое окно для создания организации -->
  <Dialog v-model:visible="visible" modal header="Введите имя"
          :style="{ width: '20rem' }" class="text-xl">
    <div class="flex flex-column gap-3">
      <InputText v-model="newOrgName" placeholder="Название организации" class="w-full text-xl" />
      <div class="flex justify-content-end">
        <Button label="Создать" class="text-xl" @click="addOrganization()" />
      </div>
    </div>
  </Dialog>

  <!-- Загрузка -->
  <div v-if="store.loading" class="p-4 text-center">
    <i class="pi pi-spin pi-spinner"></i>
  </div>

  <div v-for="organization in searchedOrganizations"
       :key="organization.id"
       class="flex flex-row glass-effect p-3 border-round-xl mt-2 overflow-y-scroll">
    <img alt="organization logo" class="w-1 mr-3 border-round"
         src="https://i.pinimg.com/736x/ec/03/77/ec037754473332101c08e0bd02e6ba65.jpg"/>

    <!-- Информация справа -->
    <div class="flex flex-column gap-2 w-full">
      <!-- Заголовок и статус -->
      <div class="flex justify-content-between align-items-start">
        <div>
          <h3 class="text-2xl font-bold mb-1">{{ organization.name }}</h3>
          <div class="flex align-items-center text-xl">
            <i class="pi pi-calendar mr-2"></i>
            <span>Создана: {{ formatDate(organization.created_at) }}</span>
          </div>
        </div>

        <div class="flex align-items-center ml-auto">
          <i class="pi pi-circle-fill mr-2 text-green-400"></i>
          <span class="text-xl">Активна</span>
        </div>

      </div>

      <!-- Адрес -->
      <div class="flex align-items-center text-xl">
        <i class="pi pi-map-marker mr-2"></i>
        <div>Адрес: Пример адреса</div>
      </div>

      <!-- Кнопки действий -->
        <div class="flex gap-2 mt-auto">
          <button class="p-2 border-none border-round cursor-pointer bg-blue-100 text-xl"
                  @click="this.$router.push({name: 'org-cameras', params: {id: organization.id}})">
            <i class="text-xl pi pi-cog mr-2"></i>
            <span>Настройки</span>
          </button>
          <button class="p-2 border-none border-round cursor-pointer bg-blue-100 text-xl">
            <i class="text-xl pi pi-chart-bar mr-2"></i>
            <span>Аналитика</span>
          </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
</style>