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

const nodeOps = {
	removeChild(node,child){
		node.removeChild(child)
	},
	insertBefore(){},
	createElement(){},
	createComment(){},
	createTextNode(){},
	parentNode(){},
	setTextContent(){}
}
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
/*
	子节点更新
		总结
			如果在oldChildren里面找不到当前循环的newChildren节点时，需要新增创建，
			如果找到了，先对比两个节点是否相同，如果相同的话更新节点，更新完节点之后查看
			是否需要移动节点
*/

function updateChildren(parentElm,oldCh,newCh,insertedVnodeQueue,removeOnly){
	
	let oldStartIdx = 0; // oldChildren 开始索引
	let oldEndIdx = oldCh.length-1;//oldChildren 结束索引
	let oldStartVnode = oldCh[0];// oldChildren 中所有未处理节点中的第一个
	let oldEndVnode = oldCh[oldStartIdx]; //oldChildren 中所有未处理节点的最后一个

	let newStartIdx = 0; // newStartIdx开始索引
	let newEndIdx = newCh.length-1; //newChildren结束索引
	let newStartVnode = newCh[0]; //newChildren中所有未处理节点中的第一个
	let newEndVnode = newCh[newStartIdx]; //newChildren中所有未处理节点中的最后一个

	let oldKeyToIdx, idxInOld,vnodeToMove,refElm;


	const canMove = !removeOnly;

	if(process.env.NODE_ENV !== 'production'){
		checkDuplicateKeys(newCh);
	}

	//以 "新前"、"新后"、"旧前"、"旧后"
	while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx){
		if(isUndef(oldStartVnode)){
			oldStartVnode = oldCh[++oldStartIdx];//如果oldStartVnode不存在，则直接跳过将oldStartIdx+1，将比对下一个
		}else if(isUndef(oldEndVnode)){
			oldEndVnode = oldCh[--oldEndIdx];//如果oldEndVnod不存在，则直接跳过将oldEndIdx-1，对比前一个
		}else if(sameVnode(oldStartVnode,newStartVnode)){
			//如果“新前”与"旧前"节点都相同，就把两个节点进行patch更新，同时oldStatrIdx和newStartIdx都+1,后移一个位置
			patchVnode(oldStartVnode,newStartVnode,insertedVnodeQueue);
			oldStartVnode = oldCh[++oldStartIdx];
			newStartVnode = newCh[++newStartIdx];
		}else if(sameVnode(oldEndVnode,newEndVnode)){
			//如果“新后”与“旧后”节点都相同，就把两个节点进行patch更新，同时oldEndIdx和newEndIdx都-1,向前移动一个位置
			patchVnode(oldEndVnode,newEndVnode,insertedVnodeQueue);
			oldEndVnode = oldCh[--oldEndIdx];
			newEndVnode = oldCh[--newEndIdx];
		}else if(sameVnode(oldStartVnode,newEndVnode)){
			//如果“新后”与"旧前"节点都相同，就把两个节点进行patch更新，然后把旧节点oldChildren移动到未处理节点之后,最后把oldStartIdx+1后移一个位置，newEndIdx-1，前移一个位置
			patchVnode(oldStartVnode,newEndVnode,insertedVnodeQueue);
			if(canMove){
				nodeOps.insertBefore(parentElm,oldStartVnode.elm,nodeOps.nextSibling(oldEndVnode.elm));
			}
			oldStartVnode = oldCh[++oldStartIdx];
			newEndVnode = newCh[--newEndIdx];
		}else if(sameVnode(oldEndVnode,newStartVnode)){
			//如果“新前”与“旧后”节点都相同，就把两个节点进行patch更新，然后把就节点oldChildren移动到未处理节点之前，最后把oldEndIdx-1前移动一个位置，newStartIdx+1,向后移动一个位置
			patchVnode(oldEndVnode,newStartVnode,insertedVnodeQueue);
			if(canMove){
				nodeOps.insertBefore(parentElm,oldEndVnode.elm,oldStartVnode.elm);
			}
			oldEndVnode = oldCh[--oldEndIdx];
			newStartVnode = newCh[++newStartIdx];
		}else{
			//如果不属于以上四种情况，就进行常规的循环对比patch

			//如果在oldChildren里面找不到当前循环的newChildren里的子节点，则需要创建
			if(isUndef(idxInOld)){
				//新增节点并插入到合适的位置
				createElm(newStartVnode,insertedVnodeQueue,parentElm,oldStartVnode,elm,false,newCh,newStartIdx);
			}else{
				//如果在oldChildren里找到了当前循环的newChildren里的子节点
				if(sameVnode(vnodeToMove,newStartVnode)){
					//调用patchVnode更新节点
					patchVnode(vnodeToMove,newStartVnode,insertedVnodeQueue);
					oldCh[idxInOld] = undefined;
					//更新完节点之后，查看是否需要移动节点
					if(canMove){
						nodeOps.insertBefore(parentElm,vnodeToMove.elm,oldStartVnode.elm)
					}
				}
			}
		}
		if(oldStartIdx > oldEndIdx){
			/*
				如果oldChildren比newChildren先循环完毕
				那么newChildren里面剩余的节点都是需要新增的节点
				把[newStartIdx,newEndIdx]之间的所有节点都插入到DOM中去
			*/
			if(isUndef(newCh[newEndIdx+1])){
				refElm =  null ;
			}else {
				refElm = newCh[newEndIdx+1].elm;
				addVnodes(parentElm,refElm,newCh,newStartIdx,newEndIdx,insertedVnodeQueue);
			}

		}else if(newStartIdx > newEndIdx){
			/*
				如果newChildren比oldChildren先循环完毕
				那么oldChildren里面剩余的节点都是需要删除的节点
				把[oldStartIdx,oldEndIdx]之间的所有节点都删除
			*/ 
			removeVnodes(parentElm,oldCh,oldStartIdx,oldEndIdx);
		}
	}
}
/*
	删除节点  removeVnodes用于删除一组指定的节点
	删除vnodes数组中从startIdx指定的位置到endIdx指定位置的内容
*/
function removeVnodes(vnodes,startIdx,endIdx){
	for(;startIdx<=endIdx;++startIdx){
		const ch  = vnode[startIdx]
		if(isDef(ch)){
			//删除视图中单个节点，
			removeNode(ch.elm);
		}
	}
}
