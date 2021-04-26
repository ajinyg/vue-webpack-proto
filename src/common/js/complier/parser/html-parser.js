const comment = /^<!\--/;
const conditionalComment = /^!\[/;
const doctype = /^<!DOCTYPE [^>]+>/i;
const ncname = '[a-zA-Z_][\\w\\-\\.]*';
const qnameCapture = `((?:${ncname}\\:))?${ncname}`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
export function parseHTML(html,options){
	while(html){
		//解析注释标签
		if(comment.test(html)){
			//若为注释，则继续查找是否存在'-->'
			const commentEnd = html.indexOf('-->')
			if(commentEnd >= 0){
				//若存在 '-->',继续判断options中是否保留注释
				if(options.shouldKeepComment){
					/*
							若保留注释，则把注释截取出来传给options.comment 
							创建注释类型的AST节点
					*/
					options.comment(html,substring(4,commentEnd))
				}
				//若不保留注释，则将游标移动到'-->'之后，继续向后解析
				advance(commentEnd + 3)
				continue;
			}
		}
		//解析条件注释
		if(conditionalComment.test(html)){
			//若为条件注释，则继续查找是否存在']>'
			const conditionalEnd = html.indexOf(']>');
			if(conditionalEnd >= 0){
				//若存在 ']>',则从原本的html字符串中把条件注释截掉
				//把剩下的内容重新赋给html，继续向后配置
				advance(conditionalEnd + 2);
				continue;
			}
		}
		/*
			解析DOCTYPE
			解析DOCTYPE的原理同解析注释完全相同
		*/
		const doctypeMatch = html.match(doctype);
		if(doctypeMatch){
			advance(doctypeMatch[0].length);
			continue;
		}
		//解析开始标签
		const start = html.match(startTagOpen);
		if(start){
			const match = {
				tagName : start[1],
				attrs:[],
				start:index
			}
		}
	}
}
//解析开始标签
function parseStartTag(){
	const start = html.match(startTagOpen);
	//'<div></div>'.match(startTagOpen) => ['<div','div',index:0,input:'<div></div>']
	if(start){
		const match = {
			tageName : start[1],
			attrs : [],
			start : index
		}
		advance(start[0].length);
		let end,attr;
		/*
			<div a=1 b=2 c=3></div>
			从<div之后到开始标签的结束符号‘>’之前，一直匹配属性attrs
			所有属性匹配完成之后，html字符串还剩下
			1.自闭合标签剩下:'/>'
			2.非自闭合标签剩下'></div>'
		*/
		while(!(end == html.match(startTagClose)) && (attr == html.match(attribute))){
			advance(attr[0].length);
			match.attr.push(attr);
		}
		/*
			这里判断了该标签是否为自闭合标签
			自闭合标签如<input type='text'/>
			非自闭合标签如：<div></div>
			'></div>'.match(html.match(startTagClose)) => [">", "", index: 0, input: "></div>", groups: undefined]
			'/>'.match(html.match(startTagClose)) => ["/>", "/", index: 0, input: "/><div></div>", groups: undefined]
			因此，我们可以通过end[1]是否是 '/'来判断该标签是否是自闭合标签
		*/ 
		if(end){
			match.unarySlash = end[1];
			advance(end[0].length);
			match.end = index;
			return match;
		}
	}
}
/*
	handleStartTag 函数用来对parseStartTag 函数的解析结果进行进一步处理，
	它接受parseStartTag函数的返回值作为参数
	handleStartTag 函数的开始定义几个常量
*/
function handleStartTag(match){
	const tagName = match.tagName; //开始标签的标签名；
	const unarySlash = match.unarySlash;//是否为自闭合标签的标志，自闭合为"" ， 非自闭合为"/"
	const unary = isUnaryTag(tagName) || !!unarySlash; //布尔值，标志是否为自闭合标签
	const l = match.attrs.length; //match.attrs数组的长度
	const attrs = new Array(l); //一个与match.attrs数组长度相等的数组
 //结下来是循环处理提取出来的标签属性数组match.attrs
 for( let i=0;i<l;i++){
 	const args = match.attrs[i];
 	//const args = ["class="a"", "class", "=", "a", undefined, undefined, index: 0, input: "class="a" id="b"></div>", groups: undefined]
 	const value = args[3] || args[4] || args[5] || ''
 	const shouldDecodeNewLines = tagName == 'a' && args[1] == 'href' ? options.shouldDecodeNewLinesForHerf : options.shouldDecodeNewLines 
 	//最后将处理好的结果存入之前定义好的与match.attrs数组长度相等的attrs数组中
 	attrs[i] = {
 		name : args[i],
 		value : decodeArr(value,shouldDecodeNewLines)
 	}
 }
 //如果标签为非自闭合标签,则将标签推入栈中
 if(!unary){
 	stack.push({tag:tagName,lowerCasedTag:tagName.toLowerCase(),attrs:attrs})
 	lastTag = tagName;
 }
 //如果该标签是自闭合标签，现在就可以调用start钩子函数并传入处理好的参数来创建AST节点了
 if(options.start){
 	options.start(tagName,attrs,unary,match.start,match.end);
 }
}
function advance(n){
	index += n; //index为解析游标
	html = html.substring(n);
}