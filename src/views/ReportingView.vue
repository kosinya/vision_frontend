<script>
import DatePicker from 'primevue/datepicker';

export default {
  name: 'ReportingView',
  components: {
    DatePicker,
  },
  data() {
    return {
      selectedDate: null,
      
      // Имитация API (дни, когда были отчеты)
      apiReportDates: [
        '2025-12-10',
        '2025-12-22', 
        '2025-12-25'
      ]
    }
  },
  methods: {
    // Проверяем, есть ли дата в списке API (синие точки)
    isDateActive(dateInfo) {
      const year = dateInfo.year;
      const month = String(dateInfo.month + 1).padStart(2, '0');
      const day = String(dateInfo.day).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      return this.apiReportDates.includes(dateString);
    }
  }
}
</script>

<template>
  <DatePicker v-model="selectedDate" inline class="w-6 border-none shadow-none custom-calendar">
      
      <template #date="slotProps"> 
        <div 
          class="flex align-items-center justify-content-center w-2rem h-2rem border-round-xl cursor-pointer transition-duration-200"
          :class="[
             // 1. Если дата ВЫБРАНА
             slotProps.selected 
                ? 'bg-blue-100 text-blue-700 font-bold border-1 border-blue-200' 
                
             // 2. Если дата есть в API
             : isDateActive(slotProps.date) 
                ? 'bg-blue-200 text-blue-800 font-bold'
                
             // 3. Обычная дата
                : 'bg-white border-gray-100 hover:surface-100'
          ]"
        >
          {{ slotProps.date.day }}
        </div>

    </template>
  </DatePicker>
</template>

<style scoped>

/* Убираем фон у выбранной ячейки */
:deep(.p-datepicker-day-selected) {
    background-color: rgb(220, 220, 220) !important;
    color: inherit !important;
}
</style>