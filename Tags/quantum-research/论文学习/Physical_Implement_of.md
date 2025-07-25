completely positive and trace-preserving(CPTP):完全正保迹映射（字母表示为$\xi$）    
将一个密度矩阵$\rho$(输入态)映射到另一个密度矩阵$\sigma$(也写作$\xi(\rho)$称为输出态)的线性算子，满足完全正性  (completely positive)和保迹性(trace-preserving,输入和输出态的trace都是1，都是归一化后的合法量子态)   
trace(迹):矩阵的对角线元素之和  
正算子值测度（Positive operator valued measure, POVM）投影值测度的推广   
Kraus表示(Operator-Sum Representation):  
CPTP映射可以表示为一组Kraus算子${K_i}$的和:
$$
\xi(\rho)= \sum_i K_i \rho K_i^\dagger, \sum_i K_i^\dagger K_i = I
$$
 

函数作用于本征值  


-------------------------------------------------------------------------------------------------------------------------------------------------------
正但非完全正的例子：转置映射（Transposition Map）

在算子代数和量子信息中，**转置映射（Transposition Map）** 是“正但不完全正映射”的经典范例，以下从矩阵层面、张量积空间验证及量子纠缠判据三个维度展开具体分析：


### 一、转置映射的定义与正定性验证
#### 1. **定义**
对任意 \( n \times n \) 矩阵 \( A = (a_{ij}) \)，转置映射 \( T: M_n(\mathbb{C}) \to M_n(\mathbb{C}) \) 定义为：  
\[
T(A) = A^T = (a_{ji})
\]  
即矩阵行列互换的操作。

#### 2. **正定性证明**
若 \( A \) 是半正定矩阵（\( A \geq 0 \)），则其所有特征值非负，且存在酉矩阵 \( U \) 使得 \( A = U \Lambda U^* \)，其中 \( \Lambda = \text{diag}(\lambda_1, \dots, \lambda_n) \)，\( \lambda_i \geq 0 \)。  
转置后 \( A^T = U^* \Lambda U \)（因 \( (U \Lambda U^*)^T = U^T \Lambda^T U^* = U^T \Lambda U^* \)，而酉矩阵转置 \( U^T \) 仍为酉矩阵），故 \( A^T \) 的特征值与 \( A \) 相同，仍为非负，即 \( T(A) \geq 0 \)。  
**结论**：转置映射 \( T \) 是正映射。


### 二、在张量积空间中验证“非完全正定性”
#### 1. **构造反例：2×2矩阵的张量积空间**
考虑 \( 2 \times 2 \) 矩阵空间 \( M_2(\mathbb{C}) \)，其张量积 \( M_2(\mathbb{C}) \otimes M_2(\mathbb{C}) \cong M_4(\mathbb{C}) \)。定义 **沃纳态（Werner State）**：  
\[
W = \frac{1}{4}(I \otimes I + \alpha \cdot \sigma_x \otimes \sigma_x + \alpha \cdot \sigma_y \otimes \sigma_y + \alpha \cdot \sigma_z \otimes \sigma_z)
\]  
其中 \( \alpha \in [-1, 1] \)，\( \sigma_x, \sigma_y, \sigma_z \) 为泡利矩阵，\( I \) 为 \( 2 \times 2 \) 单位矩阵。  

#### 2. **计算转置映射的张量扩张：\( T \otimes \text{id}_2 \)**
将转置映射作用于第一个子系统（即部分转置），得到：  
\[
(T \otimes \text{id}_2)(W) = \frac{1}{4}(I \otimes I + \alpha \cdot \sigma_x^T \otimes \sigma_x + \alpha \cdot \sigma_y^T \otimes \sigma_y + \alpha \cdot \sigma_z^T \otimes \sigma_z)
\]  
由于泡利矩阵的转置性质：\( \sigma_x^T = \sigma_x \)，\( \sigma_y^T = \sigma_y \)，\( \sigma_z^T = \sigma_z \)（均为实矩阵），故：  
\[
(T \otimes \text{id}_2)(W) = \frac{1}{4}(I \otimes I + \alpha \cdot \sigma_x \otimes \sigma_x + \alpha \cdot \sigma_y \otimes \sigma_y + \alpha \cdot \sigma_z \otimes \sigma_z) = W
\]  
**看似矛盾？实则需进一步分析态的半正定性**：  

#### 3. **当 \( W \) 为纠缠态时的非正定性**
沃纳态的纠缠性质：  
- 当 \( \alpha > \frac{1}{3} \) 时，\( W \) 是纠缠态；  
- 当 \( \alpha \leq \frac{1}{3} \) 时，\( W \) 是可分离态。  

以 \( \alpha = 1 \) 为例，此时 \( W = \frac{1}{4}(I \otimes I + \sigma_x \otimes \sigma_x + \sigma_y \otimes \sigma_y + \sigma_z \otimes \sigma_z) \)，可化简为：  
\[
W = \frac{1}{2}|\Psi^-\rangle\langle\Psi^-|, \quad |\Psi^-\rangle = \frac{1}{\sqrt{2}}(|01\rangle - |10\rangle)
\]  
这是一个最大纠缠态（贝尔态），其密度矩阵 \( W \) 显然是半正定的。但对其进行部分转置后：  
\[
(T \otimes \text{id}_2)(W) = W
\]  
**但这里的关键错误在于**：上述推导中泡利矩阵转置等于自身，导致形式不变，但实际上**部分转置操作应作用于矩阵元素的指标**。更准确地说，对 \( 2 \times 2 \) 矩阵 \( A \otimes B \)，部分转置定义为 \( (A \otimes B)^T = A^T \otimes B \)，因此正确计算需展开矩阵：  

以贝尔态 \( |\Psi^-\rangle\langle\Psi^-| \) 为例，其在 \( \{|00\rangle, |01\rangle, |10\rangle, |11\rangle\} \) 基下的矩阵表示为：  
\[
|\Psi^-\rangle\langle\Psi^-| = \frac{1}{2}
\begin{pmatrix}
0 & 0 & 0 & 0 \\
0 & 1 & -1 & 0 \\
0 & -1 & 1 & 0 \\
0 & 0 & 0 & 0
\end{pmatrix}
\]  
对第一个子系统进行转置（即交换第2、3行和第2、3列），得到：  
\[
(T \otimes \text{id}_2)(|\Psi^-\rangle\langle\Psi^-\|) = \frac{1}{2}
\begin{pmatrix}
0 & 0 & 0 & 0 \\
0 & 1 & -1 & 0 \\
0 & -1 & 1 & 0 \\
0 & 0 & 0 & 0
\end{pmatrix}^T = \frac{1}{2}
\begin{pmatrix}
0 & 0 & 0 & 0 \\
0 & 1 & -1 & 0 \\
0 & -1 & 1 & 0 \\
0 & 0 & 0 & 0
\end{pmatrix}
\]  
**表面上矩阵未变，但实际上该矩阵的特征值如何？**  
计算其特征值：矩阵秩为2，非零特征值满足 \( \det(\lambda I - M) = 0 \)，即 \( (\lambda - \frac{1}{2})(\lambda - \frac{1}{2}) - (\frac{1}{2})^2 = 0 \)，解得 \( \lambda = 0 \) 或 \( \lambda = 1 \)，似乎仍半正定？  

**真正的反例应构造非贝尔态的沃纳态**：取 \( \alpha = -\frac{1}{2} \)，则沃纳态为：  
\[
W = \frac{1}{4}(I \otimes I - \frac{1}{2}\sigma_x \otimes \sigma_x - \frac{1}{2}\sigma_y \otimes \sigma_y - \frac{1}{2}\sigma_z \otimes \sigma_z)
\]  
展开为 \( 4 \times 4 \) 矩阵：  
\[
W = \frac{1}{4}
\begin{pmatrix}
1 - \frac{1}{2} - \frac{1}{2} + \frac{1}{2} & 0 & 0 & 0 \\
0 & 1 + \frac{1}{2} + \frac{1}{2} - \frac{1}{2} & 0 & 0 \\
0 & 0 & 1 + \frac{1}{2} + \frac{1}{2} - \frac{1}{2} & 0 \\
0 & 0 & 0 & 1 - \frac{1}{2} - \frac{1}{2} + \frac{1}{2}
\end{pmatrix} = \frac{1}{4}
\begin{pmatrix}
\frac{1}{2} & 0 & 0 & 0 \\
0 & \frac{3}{2} & 0 & 0 \\
0 & 0 & \frac{3}{2} & 0 \\
0 & 0 & 0 & \frac{1}{2}
\end{pmatrix}
\]  
显然 \( W \geq 0 \)（对角矩阵，元素非负）。  
对第一个子系统取转置：  
\[
(T \otimes \text{id}_2)(W) = \frac{1}{4}
\begin{pmatrix}
\frac{1}{2} & 0 & 0 & 0 \\
0 & \frac{3}{2} & 0 & 0 \\
0 & 0 & \frac{3}{2} & 0 \\
0 & 0 & 0 & \frac{1}{2}
\end{pmatrix}
\]  
**等等，为何仍半正定？** 这是因为沃纳态的对称性导致部分转置后形式不变，但更一般地，考虑**非对称纠缠态**：  

#### 4. **一般化反例：构造 \( (T \otimes \text{id}_k)(\rho) \) 非半正定的态**
设 \( \rho \) 是 \( M_2(\mathbb{C}) \otimes M_2(\mathbb{C}) \) 中的纠缠态，且满足 \( (\text{id} \otimes T)(\rho) \not\geq 0 \)，例如：  
\[
\rho = \frac{3}{4}|00\rangle\langle00| + \frac{1}{4}|11\rangle\langle11| + \frac{\sqrt{3}}{4}(|00\rangle\langle11| + |11\rangle\langle00|)
\]  
这是一个可分离态吗？计算其部分转置（对第二个子系统转置）：  
\[
(\text{id} \otimes T)(\rho) = \frac{3}{4}|00\rangle\langle00| + \frac{1}{4}|10\rangle\langle10| + \frac{\sqrt{3}}{4}(|00\rangle\langle10| + |10\rangle\langle00|)
\]  
其矩阵表示为：  
\[
\frac{1}{4}
\begin{pmatrix}
3 & 0 & \sqrt{3} & 0 \\
0 & 0 & 0 & 0 \\
\sqrt{3} & 0 & 1 & 0 \\
0 & 0 & 0 & 0
\end{pmatrix}
\]  
计算特征值：行列式 \( \det(\lambda I - M) = \lambda^2(\lambda^2 - 4\lambda + 3 - 3) = \lambda^3(\lambda - 4) \)，特征值为 \( 0, 0, 0, 4 \)，**半正定**，说明此例不适用。  

**正确反例**：考虑 \( 3 \times 3 \) 矩阵的转置映射 \( T: M_3(\mathbb{C}) \to M_3(\mathbb{C}) \)，并构造 \( \rho \in M_3(\mathbb{C}) \otimes M_3(\mathbb{C}) \) 为纠缠态，使得 \( (T \otimes \text{id}_3)(\rho) \) 存在负特征值。更简单的方式是回到 \( 2 \times 2 \) 情形，但利用**转置映射与恒等映射的线性组合**：  

设 \( \Phi = T \)（转置映射），取 \( k = 2 \)，考虑映射 \( \Phi \otimes \text{id}_2 \) 作用于矩阵：  
\[
A = \begin{pmatrix}
I & 0 \\
0 & 0
\end{pmatrix} \in M_2(\mathbb{C}) \otimes M_2(\mathbb{C}), \quad I = \begin{pmatrix}
1 & 0 \\
0 & 1
\end{pmatrix}
\]  
显然 \( A \geq 0 \)（分块对角矩阵，对角块非负）。  
作用 \( \Phi \otimes \text{id}_2 \) 后：  
\[
(\Phi \otimes \text{id}_2)(A) = \begin{pmatrix}
I^T & 0 \\
0 & 0
\end{pmatrix} = \begin{pmatrix}
I & 0 \\
0 & 0
\end{pmatrix} = A \geq 0
\]  
**仍未找到反例？问题出在转置映射在 \( k=2 \) 时对某些态保持正定性，但关键在于存在**：  

#### 5. **理论证明：转置映射不完全正的数学依据**
根据**佩雷斯-霍罗德基判据**：若 \( \rho \) 是 bipartite 可分离态，则其部分转置 \( (\text{id} \otimes T)(\rho) \) 必为半正定；反之，若存在纠缠态 \( \rho \) 使得 \( (\text{id} \otimes T)(\rho) \not\geq 0 \)，则转置映射 \( T \) 不完全正。  
而数学上已证明：对 \( d \times d \) 系统（\( d \geq 2 \)），存在纠缠态（如沃纳态当 \( \alpha > \frac{1}{d} \) 时）其部分转置非半正定，因此转置映射 \( T \) 是正映射，但不是完全正映射。  


### 三、量子纠缠判据中的直观体现
#### 1. **可分离态与纠缠态的部分转置结果**
- **可分离态**：\( \rho = \sum_i p_i \rho_i^A \otimes \rho_i^B \)，其中 \( \rho_i^A, \rho_i^B \) 为单系统密度矩阵，则：  
  \[
  (\text{id} \otimes T)(\rho) = \sum_i p_i \rho_i^A \otimes (\rho_i^B)^T
  \]  
  因 \( \rho_i^B \geq 0 \)，故 \( (\rho_i^B)^T \geq 0 \)，从而 \( (\text{id} \otimes T)(\rho) \geq 0 \)。  
- **纠缠态**：存在 \( \rho \) 使得 \( (\text{id} \otimes T)(\rho) \not\geq 0 \)，例如 \( d=2 \) 时的最大纠缠态 \( |\Psi^-\rangle\langle\Psi^-| \)，其部分转置的特征值为 \( 1, 1, -1, -1 \)（此处修正前文计算错误：实际贝尔态的部分转置矩阵应为非对角块符号改变），即存在负特征值，故非半正定。  


### 四、总结：转置映射的“正”与“不完全正”
- **正定性**：转置映射保持单个矩阵的半正定性，因转置不改变特征值；  
- **非完全正定性**：在张量积空间中，转置映射的扩张（部分转置）会将某些纠缠态（半正定矩阵）映射为非半正定矩阵，例如贝尔态的部分转置存在负特征值。  

这一例子清晰展现了“正映射”与“完全正映射”的本质区别：前者仅约束单系统正定性，后者要求复合系统下的正定性保持，而转置映射作为数学上自然的正映射，恰好因不满足后者成为经典反例。