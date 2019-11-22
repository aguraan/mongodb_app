<template>
	<v-app>
		<v-app-bar app flat dark>
		<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
		<v-toolbar-title class="headline">
			<span>MongoDB</span>
		</v-toolbar-title>
		<v-toolbar-items>
			<!-- Nothing yet -->
		</v-toolbar-items>
		<v-spacer></v-spacer>
		<v-toolbar-items>
			<v-btn text color="success" v-if="connected" @click="disconnect">
				<v-icon left>mdi-lan-connect</v-icon>
				<span>Connected</span>
			</v-btn>
			<v-btn text v-else disabled>
				<v-icon left>mdi-lan-disconnect</v-icon>
				<span>Disconnected</span>
			</v-btn>
		</v-toolbar-items>
		<v-progress-linear
			:active="loading"
			:indeterminate="loading"
			absolute
			bottom
			color="green"
		></v-progress-linear>

		</v-app-bar>
		<v-content>
			<v-navigation-drawer v-model="drawer" app dark></v-navigation-drawer>
			<v-container>
				<router-view></router-view>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { DISCONNECT } from '@/mutationTypes'
export default {
	name: 'App',
	data: () => ({
		drawer: false
	}),
	computed: {
		...mapGetters(['loading', 'connected'])
	},
	methods: {
		disconnect() {
			if (confirm('Are you sure you want to disconnect?')) {
				this.$store.dispatch(DISCONNECT)
				.then(() => {
					this.$router.push('/')
				})
			}
		},
	},
}
</script>
