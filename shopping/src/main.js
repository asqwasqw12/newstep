import Vue from 'vue';
import VueRouter from 'vue-router';
import Routers from './router/router';
import Vuex from 'vuex';
import App from './App.vue';
import './style.css';
import axios from 'axios'

Vue.use(VueRouter);
Vue.use(Vuex);

// 路由配置
const RouterConfig = {
	// 使用 HTML5 的 History 路由模式
	mode: 'history',
	routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
	window.document.title = to.meta.title;
	next();
});

router.afterEach((to, from, next) => {
	window.scrollTo(0, 0);
});

// 数组去重
function getFilterArray(array) {
	const res = [];
	const json = {};
	for(let i = 0; i < array.length; i++) {
		const _self = array[i];
		if(!json[_self]) {
			res.push(_self);
			json[_self] = 1;
		}
	}
	return res;
}

const store = new Vuex.Store({
	state: {
		// 商品列表
		productList: [],
		// 购物车列表
		cartList: []
	},
	getters: {
		brands: state => {
			const brands = state.productList.map(item => item.brand);
			return getFilterArray(brands);
		}
	},
	mutations: {
		// 添加商品列表
		setProductList(state, data) {
			state.productList = data;
		},
		// 添加到购物车
		addCart(state, id) {
			// 先判断购物车是否已有，如果有，数量+1
			const isAdded = state.cartList.find(item => item.id === id);
			if(isAdded) {
				isAdded.count++;
			} else {
				state.cartList.push({
					id: id,
					count: 1
				})
			}
		},
		// 修改购物车中商品数量
		editCartCount(state, payload) {
			const product = state.cartList.find(item => item.id === payload.id);
			product.count += payload.count;
		},
		// 删除购物车中商品
		deleteCart(state, id) {
			const index = state.cartList.findIndex(item => item.id === id);
			state.cartList.splice(index, 1);
		},
		// 清空购物车
		emptyCart(state) {
			state.cartList = [];
		}
	},
	actions: {
		// 请求商品列表
		getProductList(context) {
			// 通过 ajax 获取
			axios.get('/eshop/product/getProduct').then(function(result) {
				context.commit('setProductList', result.data);
			})			
		}
	}
});

new Vue({
	el: '#app',
	router: router,
	store: store,
	render: h => {
		return h(App)
	}
});