/* ═══════════════════════════════════════════════
   UzPSB Design System — components.js
   Vue 3 компоненты (CDN, без сборки)
   ═══════════════════════════════════════════════

   Использование:
   ─────────────
   <script src="src/components/components.js"></script>
   <script>
       const app = Vue.createApp({ ... });
       UzComponents.registerAll(app);
       app.mount('#app');
   </script>

   Или по отдельности:
   ─────────────
   app.component('field-input', UzComponents.FieldInput);

   ═══════════════════════════════════════════════ */

const UzComponents = (() => {

    /* ─── 1. field-input ───────────────────────
       Текстовое поле или textarea (readonly вид)

       Props:
         label       : String  — текст лейбла
         modelValue  : String  — значение (v-model)
         textarea    : Boolean — textarea режим (height: 64px)
         required    : Boolean — показать красную звёздочку

       Пример:
         <field-input label="Имя" v-model="name"></field-input>
         <field-input label="Описание" v-model="desc" textarea></field-input>
    ─────────────────────────────────────────── */
    const FieldInput = {
        props: {
            label: String,
            modelValue: { type: String, default: '' },
            textarea: { type: Boolean, default: false },
            required: { type: Boolean, default: false },
            editable: { type: Boolean, default: false }
        },
        emits: ['update:modelValue'],
        template: `
            <div class="field-group">
                <div class="field-label">{{ label }}<span v-if="required" class="required"> *</span></div>
                <div v-if="textarea" :class="['field-textarea', { 'field-editable': editable }]"><p>{{ modelValue }}</p></div>
                <div v-else :class="['field-input', { 'field-editable': editable }]"><p>{{ modelValue }}</p></div>
            </div>
        `
    };

    /* ─── 2. field-select ─────────────────────
       Dropdown поле с иконкой стрелки (readonly вид)

       Props:
         label       : String  — текст лейбла
         modelValue  : String  — выбранное значение (v-model)
         options     : Array   — массив строк-вариантов
         required    : Boolean — показать красную звёздочку

       Пример:
         <field-select label="Статус" v-model="status"
             :options="['Активный', 'Закрыт']"></field-select>
    ─────────────────────────────────────────── */
    const FieldSelect = {
        props: {
            label: String,
            modelValue: { type: String, default: '' },
            options: { type: Array, default: () => [] },
            required: { type: Boolean, default: false },
            editable: { type: Boolean, default: false }
        },
        emits: ['update:modelValue'],
        setup(props, { emit }) {
            const open = Vue.ref(false);
            function toggle() {
                if (props.editable) open.value = !open.value;
            }
            function select(opt) {
                emit('update:modelValue', opt);
                open.value = false;
            }
            function onClickOutside(e) {
                open.value = false;
            }
            Vue.onMounted(() => document.addEventListener('click', onClickOutside));
            Vue.onUnmounted(() => document.removeEventListener('click', onClickOutside));
            return { open, toggle, select };
        },
        template: `
            <div class="field-group field-select-wrap" @click.stop>
                <div class="field-label">{{ label }}<span v-if="required" class="required"> *</span></div>
                <div :class="['field-input', { 'field-editable': editable }]" @click="toggle" :style="editable ? 'cursor:pointer' : ''">
                    <p>{{ modelValue }}</p>
                    <span class="icon"><img src="src/assets/icons/icon-arrow.svg" width="13" height="13" alt="" :style="open ? 'transform:rotate(180deg)' : ''"></span>
                </div>
                <div v-if="open" class="field-select-dropdown">
                    <div v-for="(opt, i) in options" :key="i" class="field-select-option" :class="{ selected: opt === modelValue }" @click="select(opt)">{{ opt }}</div>
                </div>
            </div>
        `
    };

    /* ─── 3. field-date ───────────────────────
       Поле даты с иконкой календаря (readonly вид)

       Props:
         label       : String  — текст лейбла
         modelValue  : String  — значение даты (v-model)
         required    : Boolean — показать красную звёздочку

       Пример:
         <field-date label="Дата" v-model="date"></field-date>
    ─────────────────────────────────────────── */
    const FieldDate = {
        props: {
            label: String,
            modelValue: { type: String, default: '' },
            required: { type: Boolean, default: false },
            editable: { type: Boolean, default: false }
        },
        emits: ['update:modelValue'],
        template: `
            <div class="field-group">
                <div class="field-label">{{ label }}<span v-if="required" class="required"> *</span></div>
                <div :class="['field-input', { 'field-editable': editable }]">
                    <p>{{ modelValue }}</p>
                    <span class="icon"><img src="src/assets/icons/icon-calendar.svg" width="12" height="13" alt=""></span>
                </div>
            </div>
        `
    };

    /* ─── 4. app-table ────────────────────────
       Таблица данных с заголовком, сортировкой, footer

       Props:
         title      : String — заголовок таблицы
         columns    : Array  — [{ key, label }]
         rows       : Array  — [{ [key]: value }]
         footerText : String — текст в footer (напр. "Строк: 5")
         emptyText  : String — текст при пустых данных

       Пример:
         <app-table title="История"
             :columns="[{ key: 'date', label: 'Дата' }]"
             :rows="[{ date: '01.01.2025' }]"
             footer-text="Строк: 1"></app-table>
    ─────────────────────────────────────────── */
    const AppTable = {
        props: {
            title: String,
            columns: { type: Array, default: () => [] },
            rows: { type: Array, default: () => [] },
            footerText: { type: String, default: '' },
            emptyText: { type: String, default: '' }
        },
        template: `
            <div class="data-table">
                <div class="table-header-bar">
                    <div class="table-title">{{ title }}</div>
                    <div class="table-dots">
                        <div class="dots-group"><div class="dot" v-for="n in 6" :key="n"></div></div>
                        <svg width="8" height="4" viewBox="0 0 8 4" fill="none">
                            <path d="M0.5 0.5L4 3.5L7.5 0.5" stroke="#737373" stroke-width="0.8"/>
                        </svg>
                    </div>
                </div>
                <div class="table-grid">
                    <div class="table-header-row">
                        <div v-for="(col, ci) in columns" :key="ci" class="col-header">
                            <span>{{ col.label }}</span>
                            <svg class="sort-icon" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                <path d="M4 0L7.5 4H0.5L4 0Z" fill="#8a8894"/>
                                <path d="M4 14L0.5 10H7.5L4 14Z" fill="#8a8894"/>
                            </svg>
                        </div>
                    </div>
                    <div v-for="(row, ri) in rows" :key="ri" class="table-data-row">
                        <div v-for="(col, ci) in columns" :key="ci" class="table-cell">{{ row[col.key] }}</div>
                    </div>
                </div>
                <div v-if="emptyText && rows.length === 0" class="table-empty">{{ emptyText }}</div>
                <div v-if="footerText" class="table-footer">{{ footerText }}</div>
            </div>
        `
    };

    /* ─── 5. app-btn ──────────────────────────
       Кнопка действия (outline / primary стиль)

       Props:
         label   : String  — текст кнопки
         primary : Boolean — залитая кнопка (тёмный фон)

       Events:
         click — при нажатии

       Пример:
         <app-btn label="Сохранить" @click="save"></app-btn>
         <app-btn label="Применить" primary @click="apply"></app-btn>
    ─────────────────────────────────────────── */
    const AppBtn = {
        props: {
            label: String,
            primary: { type: Boolean, default: false }
        },
        emits: ['click'],
        template: `<div :class="['action-btn', { 'action-btn-primary': primary }]" @click="$emit('click')">{{ label }}</div>`
    };

    /* ─── 6. app-checkbox ─────────────────────
       Чекбокс с лейблом

       Props:
         label      : String  — текст
         modelValue : Boolean — v-model

       Пример:
         <app-checkbox label="Согласен" v-model="agreed"></app-checkbox>
    ─────────────────────────────────────────── */
    const AppCheckbox = {
        props: {
            label: String,
            modelValue: { type: Boolean, default: false }
        },
        emits: ['update:modelValue'],
        template: `
            <div class="checkbox-item" @click="$emit('update:modelValue', !modelValue)">
                <div :class="['checkbox-box', { checked: modelValue }]"></div>
                <span class="checkbox-label">{{ label }}</span>
            </div>
        `
    };

    /* ─── Navigation routes ─── */
    const navItems = [
        'Задание', 'Основные данные', 'Статус счета', 'Обеспечения',
        'Счета', 'Платежи', 'Ставки', 'Дополнительная информация', 'Документы'
    ];
    const navRoutes = {
        0: 'task_monitoring.html',
        1: 'basic_data.html',
        2: 'account_status.html',
        3: 'collateral.html',
        4: 'accounts.html',
        5: 'payments.html',
        6: 'rates.html',
        7: 'additional_info.html',
        8: 'documents.html'
    };

    function navigateTo(index) {
        if (navRoutes[index]) {
            window.location.href = navRoutes[index];
        }
    }

    /* ─── Register helper ─── */
    function registerAll(app) {
        app.component('field-input',  FieldInput);
        app.component('field-select', FieldSelect);
        app.component('field-date',   FieldDate);
        app.component('app-table',    AppTable);
        app.component('app-btn',      AppBtn);
        app.component('app-checkbox', AppCheckbox);
    }

    return {
        FieldInput,
        FieldSelect,
        FieldDate,
        AppTable,
        AppBtn,
        AppCheckbox,
        registerAll,
        navItems,
        navRoutes,
        navigateTo
    };

})();
