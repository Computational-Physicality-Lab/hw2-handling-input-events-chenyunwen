# hw2-handling-input-events

### 姓名: 陳允玟

### 你 deploy 的網站連結
主頁：https://tranquil-bublanina-fafbaf.netlify.app
( 方塊頁面： https://tranquil-bublanina-fafbaf.netlify.app/create-your-own/index.html )

### 大略解釋你的設計，特別是你如何處理複數個事件處理程序，即你實作事件行為控制的策略

- 設有五個變數：
    - `isClick`: 判斷是否要觸發點擊，用於避免點擊事件於結束拖曳(長按)或跟隨(雙擊)模式時觸發。
    - `isMoved`: 在拖曳或跟隨模式啟動時為true。
    - `isMouseDown`: 滑鼠按鍵是否按下，用於判斷是否為拖曳模式(在滑鼠按下卻沒有放開的模式下移動)
    - `isDoubleClick`: 是否為跟隨模式。
    - `touchStart`: 判斷是否有手指觸控，似`isMouseDown`。
    - `changeSize`: 是否為變更大小模式。

(設每個可移動的`div`都會有`class="target"`)
1. `mousedown`: 只加在每個 target 下，會將`isMouseDown`設為true，並由變數記錄下當前被按下的 target 編號 (`targetID`)、位置、大小等資訊，以及滑鼠位置。
2. `mousemove`: 加在workspace下，在`isMouseDown`或`isDoubleClick`狀態時會將`isMoved`設為true，並且同時更新編號為`targetID`的`div`位置。因為若是在`isMouseDown`時移動滑鼠代表是為拖曳模式，而在`isDoubleClick`狀態移動滑鼠則為跟隨模式。
3. `mouseup`:只加在每個target下，若是`isMoved`原先為true，則將`isClick`設為false，表示接下來的第一個觸發的click是為結束拖曳或跟隨模式。將`isMouseDown`、`isMoved`、`isDoubleClick`設為false，表示結束拖曳或跟隨模式。
4. `click`: 
- 在workspace下: 如果當下非拖曳或跟隨模式(`!isMoved`)且`isClick`且點擊到背景(非`div`)，則將目前選中的``div`變回紅色。無論如何，發生點擊事件都會將`isClick`設回true(因為若是為結束其他行為，已在此次觸發click時完成)，將`isMoved`、`isDoubleClick`設為false。
- 在每個target下: 若確認非移動中且是為點擊事件(`!isMoved && isClick`)則將目前被選中(Selected)的`div`設為紅色(若有)，並且將現在被點擊的`div`設為藍色。
5. `dblclick`: 只加在每個 target 下，雙擊發生在`div`上時將`isDoubleClick`及`isMoved`設為true，觸發跟隨模式。
6. `ESC`: 如果當下為拖曳或跟隨模式(`isMoved`)，則將編號為`targetID`的`div`位置變回移動之前(`mousedown`時有紀錄)。且若非跟隨模式的話(表示為拖曳模式，滑鼠尚未放開)則將`isClick`設為false。並且將`isMouseDown`、`isMoved`、`isDoubleClick`設為false，表示結束拖曳或跟隨模式。
7. `touchstart`:
- 在workspace下: 
    * 在只有一隻手指觸碰時，記錄手指位置，並將`changeSize`設為true，使用`setTimeout`計時100ms後改回false。
    * 在第二根手指觸碰時:
        * 若`changeSize`還沒被變為false表示兩根手指幾乎同時觸碰螢幕，此時使用`clearTimeout`終止計時，並記錄第二根手指位置，並根據兩根手指相對位置判斷為水平或垂直放大。(設有變數`zoom_dir`)。
        * 若`changeSize`為false，且`isMoved`為true，表示正在拖曳或跟隨模式，此時就類似上述`ESC`將行為終止，且恢復移動中`div`位置。
    * 在第三根(含)以上手指觸碰時，如果為變更大小模式(`changeSize`)，則將改變大小中的`div`變回記錄的原先大小，且將`changeSize`改為false結束變更大小模式。
- 在每個target下: 在只有一隻手指觸碰時，記錄手指位置，並由變數記錄下當前被按下的 target 編號 (targetID)、位置、大小等資訊，以及手指位置(邏輯大致如`mousedown`)
8. `touchmove`: 加在workspace下
    * 若為變更大小模式(`changeSize`)，如果沒有任何物件被選中，或只有一根手指在螢幕上則不做任何行為(因為可能在第二根手指尚未按下的瞬間就觸發移動)。若確定為可變更大小的狀態，則根據`touchstart`所判斷之縮放方向，及目前手指的位置進行縮放(縮放的`div`水平與垂直大小，最小都為10px，嘗試使`div`的長或寬小於10px會被忽略)。
    * 若為拖曳`touchStart`或跟隨`isDoubleClick`模式，將`isMoved`設為true，並且同時更新編號為targetID的target位置，與`mousemove`邏輯相同。

9. `touchend`
    * 在workspace下: 如果目前觸控的手指 <= 1指，且目前為變更大小模式(`changeSize`)，則先記錄下當前變更大小後的狀態，以防第二根手指再次觸控改變大小。若沒有手指觸控螢幕，則表示結束變更大小模式，將`changeSize`設為false。
    * 在每個target下: 表示為拖曳模式結束，或跟隨模式暫停(可能還會繼續有下一次移動)，此時先記錄移動後位置。若為跟隨模式，則將isClick設為false，表示接下來的第一個觸發的click是為結束跟隨模式；若非跟隨模式，則將`isMoved`設為false，表示結束拖曳模式。
    
### 你所實作的加分作業項目，以及如何觸發它。
- 垂直大小變化
根據兩隻手指觸及螢幕時的相對位置，支援水平方向或是垂直方向的雙手指觸控（two-finger touch）。假如使用者觸碰螢幕時手指的水平距離>=垂直距離，則使用者能夠改變`div` 的左右界；假如水平距離<垂直距離，則能改變 `div` 的上下界。

### 其他你所實作的網站的有趣之處
無