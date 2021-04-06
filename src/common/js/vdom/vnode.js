export default class VNode {
	constructor(
		tag,//当前节点的标签名
		data,//当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型
		children,//当前节点的子节点，是一个数组
		text,//当前节点的文本
		elm,//当前虚拟节点对应的真实DOM节点
		context,//当前组件节点对应的Vue实例
		componentOptions,//组件options选项
		asyncFactory
	){
		this.tag = tag;//当前节点的标签名
		this.data = data;//当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型
		this.children = children; //当前节点的子节点，是一个数组
		this.text = text;//当前节点的文本
		this.elm = elm;//当前虚拟节点对应的真实DOM节点
		

		this.ns = undefined; //当前节点的名字空间

		this.context = context;//当前组件节点对应的Vue实例

		this.fnContext = undefined; // 函数式组件对应Vue实例
		this.fnOptions = undefined;
		this.fnScopeId = undefined;
		this.key = data && data.key;//节点的key属性，被当作节点的标志，用于优化


		this.componentOptions = componentOptions;//组件options选项
		this.componentInstance = undefined; //当前节点对应组件的实例
		this.parent = undefined;//当前节点的父节点
		this.raw = false; //简而言之口就是是否为原生HTML或是普通文本，innerHTML的时候为true,textContext的时候为false
		this.isStatic = false;//静态节点标志
		this.isRootInsert = true;//是否作为跟节点插入
		this.Comment = false;//是否为注释节点
		this.isCloned = false;//是否为克隆节点
		this.isOnce = false;//是否有v-once指令
		this.asyncFactory = asyncFactory;
		this.asyncMeta = undefined;
		this.isAsyncPlaceholder = false;
	}
	get child(){
		return this.componentInstance;
	}
}