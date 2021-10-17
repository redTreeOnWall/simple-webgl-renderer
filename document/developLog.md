
## 2021-9-30

use shader lib

shader lib
* some glsl code which is normal for all renderer object in the scene tree;
* simple struct , no state


## 需要优化
* material 和 geomotry 不应该依赖 gl, 而是在渲染器中初始化 [down]
* 渲染管线性能优化, 比如: matrix 和 uniform的脏检查.
* 封装常用的 material 和 geometry (ulit material)
* 视锥体裁剪
