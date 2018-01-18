##
步骤

* 获取 canvas
* 获取 WebGL 上下文
* 清除 canvas 背景色
* 初始化 shader
* 创建 program
* 创建 buffer
* 绑定数据
* 绘图

### WebGL 坐标系统

GL 图形语言不强制使用左手坐标系或右手坐标系。早起图形库大部分使用右手坐标系

### vertexAttribPointer(index, size, type)

指定 VBO 的内存位置（将 VBO 分配给 vertex attribute）

### enableVertexAttribArray(index)

开启 vertex attribute（连接 vertex attribute 与分配给它的缓冲区对象）