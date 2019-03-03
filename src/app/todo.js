import Keet, { html, childLike } from '../../keet/keet'
import TodoModel from './todo-model'

const ENTER_KEY = 13
const ESC_KEY = 27

@childLike()
class App extends Keet {
  el = 'todoList'
  todoModel = new TodoModel('filter')

  activeClass (obj) {
    if (!obj) return
    let cl = []
    if (obj.completed) cl = cl.concat('completed')
    if (obj.editing) cl = cl.concat('editing')
    return cl.join(' ')
  }

  addTodo (newTodo) {
    this.todoModel.add(newTodo)
  }

  evtTodo (obj, target) {
    if (target.className === 'toggle') {
      this.todoModel.update({ ...obj, completed: !obj.completed })
    } else if (target.className === 'destroy') {
      this.todoModel.destroy(obj)
    }
  }

  filterTodo (page) {
    if (page === '#/all') {
      this.todoModel.filter(null)
    } else if (page === '#/active') {
      this.todoModel.filter('completed', false)
    } else if (page === '#/completed') {
      this.todoModel.filter('completed', true)
    }
  }

  saveEditing (obj, title) {
    title === ''
      ? this.todoModel.destroy(obj)
      : this.todoModel.update({ ...obj, title: title, editing: false })
    this.isEditing = false
    this.tgt = null
  }

  focus (tgt, ln) {
    tgt.focus()
    tgt.setSelectionRange(ln, ln)
  }

  editTodo (obj, target, node) {
    if (target.nodeName !== 'LABEL') return
    this.isEditing = true
    this.tgt = node.querySelector('.edit')
    this.todoModel.update({ ...obj, editing: true })
  }

  componentDidUpdate () {
    this.tgt && this.focus(this.tgt, this.tgt.value.length)
  }

  blurTodo (obj, target, node) {
    if (!this.isEditing) return
    this.saveEditing(obj, target.value.trim())
  }

  keyTodo (obj, target, node, e) {
    if (e.which === ENTER_KEY || e.which === ESC_KEY) {
      e.which === ENTER_KEY
        ? this.saveEditing(obj, target.value.trim())
        : this.saveEditing(obj, obj.title)
    }
  }

  render () {
    return html`
      <ul id="todoList" class="todo-list" k-click="evtTodo()" k-dblclick="editTodo()" k-keydown="keyTodo()" k-blur="blurTodo(useCapture)">
        <!-- {{model:todoModel}} -->
          <li class="{{this.activeClass}}">
            <div class="view">
              <input class="toggle" type="checkbox" checked="{{completed?checked:''}}">
              <label>{{title}}</label>
              <button class="destroy"></button>
            </div>
            <input class="edit" value="{{title}}">
          </li>
        <!-- {{/model:todoModel}} -->
      </ul>
    `
  }
}

const todoList = new App()

const todoModel = todoList.todoModel

export {
  todoList as default,
  todoModel
}
