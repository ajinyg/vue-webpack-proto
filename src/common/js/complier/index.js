export const createCompiler = createCompoilerCreator(function baseCompile(template,options){
	/*
		模版编译阶段 ： 用正则方式解析 tmplate 模版中的指令、class、style、等数据，形成AST
		parse 会用正则等方式解析template模版中的指令、class、style、等数据，形成AST
	*/
	const ast = parse(template.trim(),options)
	if(options.optimize !== false){
		/*
			优化阶段：遍历AST，找出其中的静态节点，打上标记
			optimize 的主要作用是标记静态节点，这是vue在编译过程中的一处优化
			挡在进行patch的过程中，DOM-diff算法会直接跳过静态节点，从而减少了比较的
			过程，优化了patch的性能
		*/
		optimize(ast,options);
	}
	/*
		代码生成阶段： 将AST转换成渲染函数
		将AST转换成render函数字符串的过程，得到结果是render函数的字符串以及staticRenderFns字符串
	*/
	const code = generate(ast,options);
	return {
		ast,
		render:code.render,
		staticRenderFns : code.staticRenderFns
	}
})