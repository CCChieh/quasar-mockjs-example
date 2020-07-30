import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  id: 0,
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const getters = {
  isLogin: state => {
    return state.token !== ''
  },
  id: state => {
    return state.id
  },
  name: state => {
    return state.name
  },
  token: state => {
    return state.token
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login ({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo ({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response
          if (!data) {
            dispatch('resetToken')
            reject('Verification failed, please Login again.')
          }

          const { roleCode, nickname } = data
          const introduction = '用户'
          const avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          const roles = [roleCode]
          // roles must be a non-empty array
          if (!roleCode || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          commit('SET_ID', data.id)
          commit('SET_ROLES', roles)
          commit('SET_NAME', nickname)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout ({ commit, state, dispatch }) {
    commit('SET_TOKEN', '')
    commit('SET_NAME', '')
    commit('SET_ROLES', [])
    removeToken()
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
