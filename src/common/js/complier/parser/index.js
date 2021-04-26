/*
	将HTML模版字符串转换为AST，
	一边解析不同的内容一边调用对应的钩子函数生成对应的AST节点，
	最终完成将整个模版字符串转换成AST
	这就是HTML解析器所要做的工作。
*/
export function parse(template,options){
	parseHTML(template,{
		warn,
		expectHTML : options.expectHTML,
		isUnaryTag : options.isUnaryTag,
		canBeLeftOpenTag : options.canBeLeftOpenTag,
		showldDecodeNewlines : options.showldDecodeNewlines,
		showldDecodeNewlinesForHref : options.showldDecodeNewlinesForHref,
		shouldKeepComment: options.comment,

		/*
			这4个钩子函数有什么作用的？？

			我们说了，模版编译阶段主线函数parse会将HTML模版字符串转化成AST,
			而parseHTML是用来解析模版字符串的，把模版字符串中不同的内容解析出来之后，
			那么谁来把提取出来的内容生成AST呢？答案就是这4ge 钩子函数
		*/
		//当解析器到开始标签时，调用该函数,生成元素类型的AST节点
		start(tag,attrs,unary){
			let element = createASTElement(tag,attrs,currentParent);
		},
		//当解析到结束标签时，调用该函数
		end(){},
		/*
			当解析到文本时，调用该函数，生成文本类型的AST节点,
			在该钩子函数内部，
				a.首先会判断文本是不是一个带变量的动态文本，如hello...
				b.如果是动态文本，则创建动态文本类型的AST节点，
				c.如果不是动态文本，则创建纯静态文本类型的AST节点
		*/
		chars(text){
			if(text){
				let element = { 
					type : 2, 
					expression : res.expression,
					tokens : res.tokens,
					text
				}
			}else{
				let element = {
					type : 3,
					text
				}
			}
		},
		/*
			当解析到注释时，调用该函数
			生成注释类型的AST节点,
			当解析到标签的注释时，触发comment钩子函数，该钩子函数会创建一个注释类型的AST节点
		*/
		comment(text){
			let element = {
				type : 3,
				text,
				isComment:true
			}
		}
	})
	return root
}

//生成元素类型的AST节点
export function createASTElement(tag,attrs,parent){
	return {
		type : 1 ,
		tag,
		attrsList : attrs,
		attrsMap : makeAttrsMap(attrs),
		parent,
		children:[]
	}
}