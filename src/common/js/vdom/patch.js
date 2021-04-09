/*
	1.判断是否为元素节点只需要判断该VNode节点是否有tag标签即可，如果有tag属性即
	认为是元素节点，则调用createElement方法创建元素节点，通常元素节点还会有子节点，
	那就递归遍历创建所有子节点，将所有子节点创建好之后再insert插入到当前元素节点里面
	最后把当前元素节点插入到DOM中去
	2.判断是否为主食节点，只需判断VNode的isComment属性是否为true即可，若为true则为
	注释节点，则调用createComment方法创建注释节点，在插入到DOM中去
	3.如果既不是元素节点，也不是注释节点，那就染为是文本节点，则调用createTextNode方法
	创建文本节点，再插入到DOM中去
*/ 
/*
	1.创建节点
	新的VNode中有而旧的oldVNode中没有，那么就在旧的VNode中去创建
*/
function createElm(vnode,parentElm,refElm){
	const data = vnode.data;//当前节点数据
	const children = vnode.children;//当前节点的子节点
	const tag = vnode.tag;
	if(isDef(tag)){
		vnode.elm = nodeOps.createElement(tag,vnode)//创建元素节点
		createChildren(vnode,children,insertedVnodeQueue);//创建元素节点的子节点
		insert(parentElm,vnode.elm,refElm);//插入到DOM中去
	}else if (isTrue(vnode.isComment)){
		vnode.elm = nodeOps.createComment(vnode,text)//创建注释节点
		insert(parentElm,vnode.elm,refElm)//插入到DOM中去
	}else {
		vnode.elm = nodeOps.createTextNode(vnode,text);//创建为本节点
		insert(parentElm,vnode.elm,refElm);//插入到DOM中去
	}
}
/*
	2.删除节点
	新的VNode中没有而旧的oldVnode中有， 那么就在旧的中oldNode中删除
*/

function removeNode(el){
	const parent = nodeOps.parentNode(el);//获取父节点
	if(isDef(parent)){
		nodeOps.removeChild(parent,el);//调用父节点的removeChild方法
	}
}
/*
	3.更新节点 ----- 重点 ！ ！ ！ ！ ！ ！ ！ 
	新的VNode中有并且旧的oldVNode中也没有，那么就以新的为准，更新旧的oldVNode
*/

function patchVnode(oldVNode,vnode,insertedVnodeQueue,removeOnly){
	//vnode与oldvnode是否完全一样？若是，退出程序
	if(oldVNode === vnode ){
		return
	}
	const elm = vnode.elm == oldVNode.elm;
	//vnode与oldVNode是否都是静态节点，若是,退出程序
	if(
		isTrue(vnode.isStatic)) && 
		isTrue(oldVNode.isStatic) && 
		vnode.key === oldVNode.key && 
		(isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
	{
		return
	}
	const oldCh = oldVNode.children;
	const ch = vnode.children;
	//vnode有text属性 ？ 若没有 ： 
	if(isUndef(vnode.text)){
		//vnode的子节点与oldVnode的子节点是否都存在？
		if(isDef(oldCh) && isDef(ch)){
			/*
					若都存在，判断子节点是否相同，
					不同则更新子节点
			*/
			if(oldCh !== ch){
				updataChildren(elm,oldCh,ch,insertedVnodeQueue,removeOnly);
			}

		}
		//若只有vnode的子节点存在？
		else if(isDef(ch)){
			/*
				判断oldVnode是否有文本？ 
				若没有，则把vnode的子节点添加到真实DOM中去
				若有，则把oldVnode子节点文本清空，在把vnode的子节点添加到真实的DOM中去
			*/
			if(isDef(oldVNode.text)){
				nodeOps.setTextContent(elm,'');
			} 
			//没有情况下，则把vnode的子节点添加到真实的DOM中去
			addVnodes(elm,null,ch,0,ch.length-1,insertedVnodeQueue);
		}

		//若只有oldVnode的子节点存在 ？ 
		else if(isDef(oldCh)){
			//若只有oldVnode中的子节点存在， 则清空DOM中的子节点
			removeVnodes(elm,oldCh,0,oldCh.length-1);
		}
		//若vnode和oldnode都没有子节点，但是oldnode中有文本
		else if(isDef(oldVNode.text)){
			//清空oldnode文本
			nodeOps.setTextContent(elm,'');
		}
		/*
			上面两个判断一句话概括，如果vnode中既没有text，也没有子节点，
			那么对应的oldnode中有什么就清空什么
		*/
	}

	//若有，vnode的text属性与oldvnode的text属性是否相同
	else if(oldVNode.text !== vnode.text){
		//若不相同 ：则用vnode的text替换真实DOM文本
		nodeOps.setTextContent(elm,vnode,text);
	}
}
