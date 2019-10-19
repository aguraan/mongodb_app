<template>
    <div class="d-inline-block">
        <div 
            :class="classes[type]"
            @click="open" 
            :style="{display: (isActive ? 'none' : 'inline-block') + '!important'}"
        >
            <slot></slot>
        </div>
        <input
            ref="input"
            class="input"
            :class="classes[type]"
            :style="{display: (!isActive ? 'none' : 'inline-block') + '!important'}"
            type="text"
            :value="originalValue"
            :placeholder="label"
            @input="onInput($event)"
            @keypress="onKeyPressed($event)"
            @blur="cancel"
        >
    </div>
</template>
<script>
export default {
    name: 's-edit-dialog',
    data: () => ({
        isActive: false,
        originalValue: null,
        classes: {
            number: 'indigo--text',
            string: 'blue--text',
            boolean: 'indigo--text'
        }
    }),
    props: ['returnValue', 'label'],
    computed: {
        type() {
            const value = this.originalValue
            if (typeof value === 'number') return 'number'
            if (typeof value === 'boolean') return 'boolean'
            if (typeof value === 'string') return 'string'
            return null
        }
    },
    methods: {
        save() {
            if (this.returnValue !== this.originalValue) {
                this.$emit('s-save')
                this.$emit('update:return-value', this.originalValue)
                setTimeout(() => {
                    this.isActive = false
                })
            } else {
                setTimeout(() => {
                    this.$refs.input.blur()
                })
            }
        },
        cancel() {
            setTimeout(() => {
                this.isActive = false
            })
            this.$emit('s-cancel')
        },
        open() {
            this.originalValue = this.returnValue || ''
            const { input } = this.$refs
            input.size = this.originalValue.toString().length || 1
            this.isActive = true
            setTimeout(() => {
                input.focus()
            })
        },
        onInput(e) {
            const { value } = e.target
            if (this.type === 'number') {
                this.originalValue = value * 1
            } else {
                if (value === 'true') this.originalValue = true
                else if (value === 'false') this.originalValue = false
                else this.originalValue = value
            }
            this.$refs.input.size = this.originalValue.toString().length || 1
        },
        onKeyPressed(e) {
            e.keyCode === 13 && this.save()
        }
    }
}
</script>
<style scoped>
.input:focus {
    outline-color: #F57C00;
}
</style>