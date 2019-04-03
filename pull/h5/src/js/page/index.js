define(["axios", "BScroll"], function(axios, BScroll) {
    const nav = document.querySelector('.nav');
    const content = document.querySelector('.con-list');
    const lis = document.querySelectorAll('span');
    const Scroll = document.querySelector('.scroller');
    const pullup = document.querySelector('.pullup');
    const box = [...document.querySelectorAll('.list')];
    let flag = false;
    let idx = 0;
    let type = "饭圈头条";
    let page = 1;
    let total = 0;
    let skip = 0;
    let [a, b] = [
        [],
        []
    ]
    var BS = new BScroll('.scroller', {
        probeType: 2
    })

    function init() {
        render(type, 0, 7)
        bind();
    }


    function render(tar, s, l) { //获取数据
        let html = '';
        axios.post('/users/getdata', {
            'type': type,
            limit: l,
            skip: s
        }).then((result) => {
            total = result.total;
            renderList(watchFull(result.data.data))
        });
        BS.refresh();
    }

    function watchFull(data) { //瀑布流 获取数据
        data.forEach(val => {
            if (!a.length) {
                a.push(val);
                return;
            }
            if (!b.length) {
                b.push(val);
                return
            }
            if (a.reduce((s, v) => { return s + v.imgH * 1 }, 0) < b.reduce((s, v) => { return s + v.imgH * 1 }, 0)) {
                a.push(val)
            } else {
                b.push(val)
            }
        })
        return [a, b]
    }

    function renderList(data) {//
        data.map(function(item, i) {
            box[i].innerHTML += item.map((val, index) => {
                if (index < box[i].id) {
                    return;
                }
                box[i].id = index + 1;
                return ` <li>
                        <img src="${val.img}" alt="" style='height:${val.imgH}px'>
                        <p>${val.name}</p>
                        </li>`
            }).join('')
        })


    }

    function bind() {
        nav.addEventListener('click', function(e) { //tab切换
            let tar = e.target;
            if (tar.nodeName === 'SPAN') {
                lis[idx].classList.remove('active')
                tar.classList.add('active');
                idx = tar.getAttribute('data-index');
                type = tar.innerHTML;
            }
            [a, b] = [
                [],
                []
            ]
            box.forEach((item) => {
                item.innerHTML = '';
                item.id = 0;
            })
            render(type, 0, 7)
        })
        BS.on('scroll', function() {
            if (this.y < this.maxScrollY - 50) {
                flag = true;
                pullup.innerHTML = '释放刷新'
            } else {
                flag = false;
                pullup.innerHTML = '上拉加载'
            }
        })
        BS.on('scrollEnd', function() {
            if (flag) {
                var type = document.querySelector('.nav .active').innerHTML;
                page++;
                render(type, (page - 1) * 7, 7);
                pullup.innerHTML = '上拉加载'
            } else {
                pullup.innerHTML = '没有更多数据'
            }
        })
    }

    init();
});