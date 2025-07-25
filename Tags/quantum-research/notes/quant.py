import quairkit as qkit
import torch # library for tensor manipulation

from quairkit import Circuit # standard quantum circuit interface
from quairkit.database.state import zero_state
from quairkit.database import pauli_group,heisenberg_weyl,h
from quairkit.qinfo import state_fidelity


#-------------------------------------
'''notes:Batch computation
pauli_group可以产生泡利算符集合，电路本身还是单qubit的，
但是4组操作分别作用，进行批量计算，一次模拟多组单比特操作
   question:同批次复杂度与批量大小有关？
'''
#-------------------------------------
target_state = zero_state(1) # 1量子比特的 |0> 态
# print(zero_state(1))
unitary_data = pauli_group(1) #一个张量，包含四个基本的泡利算符:I,X,Y,Z
# print(pauli_group(1))

cir = Circuit(1) # 1qubit的空电路
cir.oracle(unitary_data, 0) #oracle是自定义的量子门，在此的作用是将改组泡利算符作用到第0个量子比特上
# print(cir)
# ry门是量子计算中常用的单比特门，表示绕Y轴旋转一个角度θ
#这里的空电路只有1qubit所以只有第一个参数起作用
cir.ry(param = [0, 1, 2, 3]) #参数通常是弧度制
output_state = cir() #执行电路，得到输出态，默认输入零态
# state_fidelity计算两个量子态之间的保真度
print(state_fidelity(cir(), target_state))
#--------------------------------------
'''notes:Qudit computation
两体量子系统的联合操作和量子态追踪，总维数是2*3=6
创建了一个两体量子系统，生成36个不同的结果态
对qutrit(第一体)应用Hadamard门（该操作由qubit控制），
对qutrit进行量子迹操作而提取出qubit子系统的状态，
从而分析纠缠对qubit的影响
'''
#--------------------------------------

cir = Circuit(2, system_dim=[2, 3]) # 一个两体的量子系统，第一体是qubit,第二体是qutrit
# print(dir(cir))
cir.oracle(heisenberg_weyl(6), [0, 1]) 
#生成海森堡-外尔算符集合，与系统维度2*3=6匹配的算符组，批量包含6^2个算符
#6维空间{∣00⟩,∣01⟩,∣02⟩,∣10⟩,∣11⟩,∣12⟩}
# heisenberg_weyl(6)生成的36个算符是针对整个6维系统的，但实际实现时，是通过子系统算符的张量积构建的
#每个算符可以写成A ⊗ B的形式，其中A是作用在qubit上的算符，B是作用在qutrit上的算符
#意义是同时操作qubit和qutrit，实现两体之间的纠缠和相互作用
'''partial trace
# (当处理多个量子系统时，当系统相互作用或处于纠缠态时，它们之间的联合状态是各个子系统状态空间的张量积，他们的联合状态无法简单分解为各自独立状态的乘积)
如果两体联合状态是纯态，那么部分迹后通常是混合态，如果本来是混合态，那么部分迹相当于对非求迹的所有可能状态求和

'''
#[0, 1]指定算符作用在第0体(qubit)和第1体(qutrit)上,实现多体联合操作
#整体是并行地将每个算符应用到系统上，生成36个不同的结果，最终得到一个批量态
cir.oracle(h(), [1, 0], control_idx = 0)
#h()是qubit里的哈达玛hadamard门,
# H = 1/2**0.5*torch.tensor([[1, 1], [1, -1]]) #Hadamard门的矩阵表示
#[1, 0]是指定操作的子系统顺序，前一个代表target，后一个代表control,
# 说明目标端是第一子系统qutrit,控制端是第二子系统
traced_state = cir().trace(1) #对第一体进行量子迹操作，
# 即剔除qutrit的自由度，只保留qubit的状态，结果是一批2维qubit的密度矩阵
'''cir().trace(1)
先执行电路，得到输出量子态，然后对这个量子态做迹操作，这是正确的用法。
cir.trace(1)
直接对电路对象做迹操作，通常是错误的，因为电路对象本身没有 trace 方法，只有量子态对象才有。
'''
print('The 6th and 7th state for the batched qubit state is', traced_state[5:7]) #输出批量计算后qubit里第6，7组的结果
#--------------------------------------
'''notes:Probabilistic computation

'''
#--------------------------------------
from quairkit.database import eye, x
from quairkit.database import random_state,bell_state
from quairkit.qinfo import nkron
M1_locc = torch.stack([eye(), x()]) # eye()是单位矩阵，x()是泡利X门
# stack将两个矩阵沿新维度堆叠，形成一个2x2x2的张量
#将X门应用为测量结果为1的情况
M2_locc = torch.stack([eye(), x()])

#set protocol协议
cir = Circuit(3)
cir.cnot([0, 1]) #应用CNOT门，控制端=0, 目标端=1
cir.h(0) #对第0个量子比特应用Hadamard门
cir.locc(M1_locc, [1,2]) #在qubit1上测量，应用局部操作在qubit2上
cir.locc(M2_locc, [1,2]) 

psi = random_state(1, size=100)
# 输入态 = 待传输态 ⊗ Bell态
input_state = nkron(psi, bell_state(2)) # 创建2qubit的bell态，即qubit的0和1处于纠缠态
output_state = cir(input_state).trace([0, 1]) #执行电路并剔除前两个qubit，只保留第三个qubit（传输目标）的状态

fid = state_fidelity(output_state.expec_state(), psi).mean().item()
print('The average fidelity of the teleportation protocol is', fid)


#--------------------------------------
'''notes:Plot circuit with LaTeX
question:为什么默认保存在Temp
'''
#--------------------------------------
import os
print("当前工作目录：", os.getcwd())
# cir: Circuit = Circuit(2) # 创建一个2量子比特的电路
cir = Circuit(2)
cir.h(0)
cir.cx([0, 1])
cir.plot(print_code=True,filename = "circuit.pdf") # 打印电路代码

#--------------------------------------
'''notes:Fast construction
'''
#--------------------------------------
cir = Circuit(2)
cir.rx()# apply Hadamard gate on all qubits
#这对吗，好像是在指定量子比特上添加绕X轴的单量子比特旋转门
cir.complex_entangled_layer(depth = 2)#应用深度为2层的复杂纠缠层，会在量子比特间创建特定的纠缠关系

cir.universal_two_qubits()# apply universal two-qubit gate with random parameters

#---------------------------------------
'''notes:Implicit transition
'''
#---------------------------------------
cir = Circuit(3)
cir.complex_entangled_layer(depth = 3)#添加深度为3的复杂纠缠层，构建基础的量子操作结构
print(cir().backend)#打印当前电路的1后端，初始情况一般都是纯态的（如state_vector)
print(cir().transpose([0,1]).backend)
# 对前两个量子比特做“部分转置”操作（混合态分析常用手段），操作后后端自动适配混合态需求，转为 density_matrix（密度矩阵，适合描述混合态）  
cir.depolarizing(prob=0.1)# 给电路加 depolarizing 噪声（模拟实际量子硬件中噪声干扰，prob=0.1 是噪声概率），噪声操作后，后端维持适合混合态/含噪模拟的 density_matrix 形式
print(cir().backend)



