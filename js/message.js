!function () {
    var view = document.querySelector('section.message')

    var model = {
        init: function () {
            var APP_ID = 'A8GbNUsXHJwOMewmRQuQVszl-gzGzoHsz'
            var APP_KEY = 'pwjKJ1YjQLNzAinUAKvtWyYJ'
            AV.init({ appId: APP_ID, appKey: APP_KEY })
        },
        //获取数据
        fetch: function () {
            var query = new AV.Query('Message');
            return query.find() //find是一个Promise对象
        },
        //保存数据
        save: function (name,content) {
            var Message = AV.Object.extend('Message');
            var message = new Message();
            return message.save({  //Promise对象
                'name': name,
                'content': content
            })
        }
    }

    var controller = {
        view: null,
        model: null,
        init: function (view,model) {
            
            this.view = view
            this.model = model
            this.messageList = view.querySelector('#messageList')
            this.model.init()
            this.form = view.querySelector('#postMessageForm')
            this.loadMessage()
            this.bindEvents()
        },
        loadMessage: function () {
            this.model.fetch()
                .then(
                    (messages) => {
                        let arry = messages.map((item) => item.attributes)
                        arry.forEach((item) => {
                            let li = document.createElement('li')
                            li.innerText = `${item.name}: ${item.content}`
                            this.messageList.append(li)
                        })
                    }, function (error) {
                        alert('提交失败')
                    });
                
        },
        bindEvents: function () {

            this.form.addEventListener('submit', function(e){
                e.preventDefault()
                this.saveMessage() //阻止刷新页面
            }.bind(this))
        },
        saveMessage: function () {
            let myForm = this.form
            let content = myForm.querySelector('input[name=content]').value
            let name = myForm.querySelector('input[name=name]').value
            this.model.save(name, content).then(function (object) {
                let li = document.createElement('li')
                li.innerText = `${object.attributes.name}: ${object.attributes.content}`
                let messageList = document.querySelector('#messageList')
                messageList.append(li)
                myForm.querySelector('input[name=name]').value = ''
                
            })
        }
    }
    controller.init(view,model)

}.call()


