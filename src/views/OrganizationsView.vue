<script>
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';

export default {
  name: 'OrganizationsView',
  components: {
    Dialog,
    InputText,
    Button,
    Select,
  },
  data() {
    return {
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
      ],
      // Список организаций
      // TODO: Удалить добавлении API
      organizations: [
        {
          id: 1,
          name: 'ООО "Сбер"',
          createdAt: '2023-05-15',
          address: 'г. Москва, ул. Тверская, д. 10, офис 505',
          status: 'active',
          image: "https://жкрусскийсевер.рф/assets/cache_image/assets/files/img/banks/sber_570x570_fd2.jpg"
        },
        {
          id: 1,
          name: 'ООО "ПочтаБанк"',
          createdAt: '2023-06-15',
          address: 'г. Москва, ул. Тверская, д. 10, офис 505',
          status: 'active',
          image: "https://жкрусскийсевер.рф/assets/cache_image/assets/files/img/banks/pochta_570x570_fd2.jpg"
        },
        {
          id: 1,
          name: 'ООО "ВТБ"',
          createdAt: '2023-08-15',
          address: 'г. Москва, ул. Тверская, д. 10, офис 505',
          status: 'active',
          image: "https://mariupol.gosuslugi.ru/netcat_files/generated/97/139/760x570/833/8ef1b78ef551488a260b0753c523292c.jpg?crop=0%3A0%3A0%3A0&hash=1b8b8d8a96e39042e12a3003548c1cc9&resize_mode=0&wm_m=0"
        }
      ]
    }
  },
  methods: {
    createOrganization() {
      if (!this.newOrgName) return;

      const newOrg = {
        id: Date.now(),
        name: this.newOrgName,
        createdAt: new Date().toISOString(),
        // Копирование остальных полей
        address: 'г. Москва, ул. Тверская, д. 10, офис 505',
        status: 'active'
      };

      this.organizations.push(newOrg);
      // Сброс данных
      this.newOrgName = '';
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
    searchedOrganizations() {
      let result = this.organizations;

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

    <!-- Кнопка для добавления организации -->
    <div class="flex justify-content-end">
      <button
          @click="visible = true"
          class="pi pi-plus p-2 border-round-xl cursor-pointer bg-white border-none shadow-1 text-900"
          title="Добавить"
      ></button>
    </div>

  </div>

  <!-- Диалоговое окно для создания организации -->
  <Dialog
      v-model:visible="visible"
      modal
      header="Введите имя"
      :style="{ width: '20rem' }"
  >
    <div class="flex flex-column gap-3">
      <InputText v-model="newOrgName" placeholder="Название организации" class="w-full" />
      <div class="flex justify-content-end">
        <Button label="Создать" @click="createOrganization" />
      </div>
    </div>
  </Dialog>

  <div v-for="organization in searchedOrganizations"
      :key="organization.id"
      class="flex flex-row glass-effect p-3 border-round-xl mt-2"
  >
    <img
        alt="organization logo"
        class="w-1 mr-4 border-round object-fill"
        :src="organization.image"
    />

    <!-- Информация справа -->
    <div class="flex flex-column gap-2 w-full">
      <!-- Заголовок и статус -->
      <div class="flex justify-content-between align-items-start">
        <div>
          <h3 class="text-xl font-bold">{{ organization.name }}</h3>
          <div class="flex align-items-center">
            <i class="pi pi-calendar mr-2 text-sm"></i>
            <span>Создана: {{ formatDate(organization.createdAt) }}</span>
          </div>
        </div>
        <div class="flex align-items-center ml-auto">
          <i class="pi pi-circle-fill mr-2 text-green-400"></i>
          <span class="text-sm">Активна</span>
        </div>
      </div>

      <!-- Адрес -->
      <div class="flex align-items-center">
        <i class="pi pi-map-marker mr-2"></i>
        <div class="text-sm">Адрес: {{ organization.address }}</div>
      </div>

      <!-- Кнопки действий -->
        <div class="flex gap-2 mt-auto">
          <button class="p-2 border-none border-round cursor-pointer bg-blue-100">
            <i class="pi pi-cog mr-2"></i>
            <span>Настройки</span>
          </button>
          <button class="p-2 border-none border-round cursor-pointer bg-blue-100">
            <i class="pi pi-chart-bar mr-2"></i>
            <span>Аналитика</span>
          </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
</style>