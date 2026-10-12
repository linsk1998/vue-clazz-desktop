基于我对路由的理解，我提出我的路由架构设计，你评价一下

1。Route 组件（对标 router-view 和 Outlet）.向子孙组件 Provide 自身；inject 祖先的 Route 组件，如果没有，当前组件就是顶层 Route。业务组件向顶层 Route 传入配置和路径，顶层 Route 检查匹配到的路由配置，然后渲染匹配到组件路
由配置方式是从上到下，而非越具体的路径，优先级越高。配置中可传入 loading 组件和错误展示组件

2。被匹配到的组件可以用 inject 获取到所属 Route 对象，其中可以获取完整路径和所属 Route 路径，这可以截取出子路径。可以在组件内使用<Route>实现子路由，可向其中传入子路由配置和子路径。如果子路由检测到没有传入路由配置和路径，就会直接从上级 Route 对象中获取，通过配置.children，和路径截取

3。1 和 2 递归调用形成完整树结构

4。HistoryPathRouter 是 Route 组件的封装用 history api 监听路径变化，然后传给内部的<Route>组件，首次是直接从 location 获取向子孙组件 Provide 自身，并提供各种跳转 API如果不支持 history api，触发的是传统 URL 跳转，是有刷新的跳转

5。HistoryHashRouter 是 Route 组件的封装路径 hash 变化，然后传给内部的＜Route > 组件，首次是直接从 location.hash 获取向子孙组件 Provide 自身，并提供各种跳转 API

6。HistoryStateRouter 是 Route 组件的封装用 history api 监听 State 变化，然后传给内部的<Route>组件，首次是 / 向子孙组件 Provide 自身，并提供各种跳转 API 可以达到路径不变，但有历史的效果如果不支持 history api，存的是内存变量，也不产生历史

7。HashRouter 是 Route 组件的封装首次是直接从 location.hash 获取然后传给内部的<Route>组件，不监听路径 hash 变化向子孙组件 Provide 自身，并提供各种跳转 API，跳转 API 最終调用 history.replace 或 location.replace，不产生历史路径 hash 变化只由跳转 API 触发

8。MemoryRouter 是 Route 组件的封装内存变量传给内部的<Route>组件，不产生历史向子孙组件 Provide 自身，并提供各种跳转 API

9。4.5.6.7. 这些 Router 都有跳转 API，路由守卫在这些跳转 API 调用时发生
通过洋葱模型运行完成后，将最终路径传内部<Route>组件

10。可嵌套使用：HistoryPathRouter>HistoryHashRouter>HistoryStateRouter> MemoryRouter

11。多子路由场景。比如一个页面下有 2 组独立 TaDs，每组都有路由功能，可以放 2 个 HistoryStateRouter

12。子路由配置懒加载，比如在微前端场景。初始只有首级应用路由的配置，首级应用的子路由配置，可以在首级应用的组件中传给里面的<Route>


13。管理后台多页面共存形式的路由设计业务代码里需要一个变量来存历史记录，需要一个数组状态来存打开了哪些页面
使用数组状态渲染多个<Route>使用不同路径
路由路径只决定哪个页面是激活的。低版本只渲染当前页面页面上有个关闭按钮，点击后，如果当前页面是激活的，需要额外退后，否则只是关闭 tab页面以下的子路田不能使用带历史的路由形式

14。手机端页面栈形式的路由
业务代码里需要一个数组做栈来存打开了哪些页面使用数组状态演染多个<Route>使用不同路径
