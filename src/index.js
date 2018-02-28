import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class TodoItem extends React.Component {
    handleCheckBox(){
        if(this.props.onCheckBoxChange){
            this.props.onCheckBoxChange()
        }
    }
    handledelete(){
        if(this.props.onDelete){
            this.props.onDelete()
        }
    }
    render() {
        if (this.props.visible) {
            return (
                <li>
                    <input className="checkButton" type="checkbox" checked={this.props.item.completed} onChange={this.handleCheckBox.bind(this)} />
                    <input className="inputText" type="text" disabled value={this.props.item.content}/>
                    <button className="delBtn" onClick={this.handledelete.bind(this)}>del</button>
                </li>
            )
        }
        return null;
    }
}
class TodoList extends React.Component {
    handleCheckBoxChange(index){
        if(this.props.onCheckBoxChange){
            this.props.onCheckBoxChange(index)
        }
    }
    handleDelete(index){
        if(this.props.onDelete){
            this.props.onDelete(index)
        }
    }
    render() {
        var rows = [];
        if (!this.props.items) {
            return null;
        }
        this.props.items.forEach((item, index) => {
            rows.push(<TodoItem item={item} visible={this.props.status === "all" || this.props.status === item.completed} key={index} onCheckBoxChange={this.handleCheckBoxChange.bind(this,index)} onDelete={this.handleDelete.bind(this,index)}/>);
        });
        return (
            <ul>{rows}</ul>
        )
    }
}

class TodoInput extends React.Component {
    keyUp(e) {
        if (e.keyCode === 13 && this.props.onEnter) {
            this.props.onEnter(e.target.value, () => {
                this.textInput.value = ""
            })
        }
    }
    checkAll(){
        if(this.props.onCheckAll){
            this.props.onCheckAll();
        }
    }
    render() {
        return (
            <div>
                <button onClick={this.checkAll.bind(this)}>全选</button>
                <input placeholder='今天要做什么？' onKeyUp={this.keyUp.bind(this)} ref={(input) => { this.textInput = input }} />
            </div>
        )
    }
}
class TodoOption extends React.Component {
    handleStatusChange(status) {
        if (this.props.onStatusChange) {
            this.props.onStatusChange(status)
        }
    }
    render() {
        return (
            <div>
                <span>剩余{1}条</span>
                <ul>
                    <li onClick={this.handleStatusChange.bind(this, "all")}>All</li>
                    <li onClick={this.handleStatusChange.bind(this, false)}>Active</li>
                    <li onClick={this.handleStatusChange.bind(this, true)}>Completed</li>
                </ul>
                <button>清除</button>
            </div>
        )

    }
}
class TodoContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            items: JSON.parse(localStorage.getItem("itemList")),
            itemStatus: "all"
        }
        this.handleStatusChange = this.handleStatusChange.bind(this)
        this.handleEnterKey = this.handleEnterKey.bind(this)    }
    handleStatusChange(status) {
        this.setState({
            itemStatus: status
        })
    }
    handleCheckBoxChange(index){
        let itemList = JSON.parse(localStorage.getItem('itemList'));
            itemList[index].completed=!itemList[index].completed;
            localStorage.setItem("itemList", JSON.stringify(itemList))
            this.setState({
                items: JSON.parse(localStorage.getItem("itemList"))
            })  
    }
    handleEnterKey(value, callback) {
        let item = { content: value, completed: false };
        if (localStorage.getItem('itemList')) {
            let itemList = JSON.parse(localStorage.getItem('itemList'));
            itemList.push(item);
            localStorage.setItem("itemList", JSON.stringify(itemList))
        } else {
            let itemList = [];
            itemList.push(item);
            localStorage.setItem("itemList", JSON.stringify(itemList))
        }
        this.setState({
            items: JSON.parse(localStorage.getItem("itemList"))
        })
        callback();
    }
    handleDelete(index){
        let itemList = JSON.parse(localStorage.getItem('itemList'));
        let newList=[...itemList.slice(0,index),...itemList.slice(index+1)]
            localStorage.setItem("itemList", JSON.stringify(newList))
            this.setState({
                items: JSON.parse(localStorage.getItem("itemList"))
            })  
    }
    handleCheckAll(){
        let ifSame=false;        
        let itemList = JSON.parse(localStorage.getItem('itemList'));
        if(ifSame){
            itemList.forEach((item)=>{
                    item.completed=!item.completed;
            })
        }else{
            itemList.forEach((item)=>{
                item.completed=true;
        })
        ifSame=true;
        }
            localStorage.setItem("itemList", JSON.stringify(itemList))
            this.setState({
                items: JSON.parse(localStorage.getItem("itemList"))
            })  
    }
    render() {
        return (
            <div>
                <TodoInput onEnter={this.handleEnterKey} onCheckAll={this.handleCheckAll.bind(this)} />
                <TodoList items={this.state.items} status={this.state.itemStatus} onCheckBoxChange={this.handleCheckBoxChange.bind(this)} onDelete={this.handleDelete.bind(this)}/>
                <TodoOption onStatusChange={this.handleStatusChange} />
            </div>
        )


    }
}

ReactDOM.render(
    <TodoContainer />, document.getElementById('root')
)