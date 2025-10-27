export var TreeSelect = {
    'zh-CN': {
        title: '树选择',
        settings: {
            'x-component-props': {
                mode: {
                    title: '模式',
                    dataSource: ['多选', '标签', '单选'],
                },
                autoClearSearchValue: {
                    title: '选中自动清除',
                    tooltip: '仅在多选或者标签模式下支持',
                },
                defaultActiveFirstOption: '默认高亮第一个选项',
                defaultOpen: '默认展开',
                filterOption: '选项筛选器',
                filterSort: '选项排序器',
                labelInValue: {
                    title: '标签值',
                    tooltip: '是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 string 变为 { value: string, label: ReactNode } 的格式',
                },
                listHeight: '弹窗滚动高度',
                maxTagCount: {
                    title: '最多标签数量',
                    tooltip: '最多显示多少个 tag，响应式模式会对性能产生损耗',
                },
                maxTagPlaceholder: {
                    title: '最多标签占位',
                    tooltip: '隐藏 tag 时显示的内容',
                },
                maxTagTextLength: '最多标签文本长度',
                showArrow: '显示箭头',
                virtual: '开启虚拟滚动',
                dropdownMatchSelectWidth: {
                    title: '下拉选择器同宽',
                    tooltip: '默认将设置 min-width，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动',
                },
                showCheckedStrategy: {
                    title: '复选回显策略',
                    tooltip: '配置 treeCheckable 时，定义选中项回填的方式。TreeSelect.SHOW_ALL: 显示所有选中节点(包括父节点)。TreeSelect.SHOW_PARENT: 只显示父节点(当父节点下所有子节点都选中时)。 默认只显示子节点',
                    dataSource: ['显示所有', '显示父节点', '显示子节点'],
                },
                treeCheckable: '开启复选',
                treeDefaultExpandAll: '默认展开所有',
                treeDefaultExpandedKeys: {
                    title: '默认展开选项',
                    tooltip: '格式：Array<string | number>',
                },
                treeNodeFilterProp: {
                    title: '节点过滤属性',
                    tooltip: '输入项过滤对应的 treeNode 属性',
                },
                treeDataSimpleMode: {
                    title: '使用简单数据结构',
                    tooltip: "\u4F7F\u7528\u7B80\u5355\u683C\u5F0F\u7684 treeData\uFF0C\u5177\u4F53\u8BBE\u7F6E\u53C2\u8003\u53EF\u8BBE\u7F6E\u7684\u7C7B\u578B (\u6B64\u65F6 treeData \u5E94\u53D8\u4E3A\u8FD9\u6837\u7684\u6570\u636E\u7ED3\u6784: [{id:1, pId:0, value:'1', title:\"test1\",...},...]\uFF0C pId \u662F\u7236\u8282\u70B9\u7684 id)",
                },
                treeNodeLabelProp: { title: '标签显示名称', tooltip: '默认为title' },
                filterTreeNode: '节点过滤器',
            },
        },
    },
    'en-US': {
        title: 'TreeSelect',
        settings: {
            'x-component-props': {
                mode: {
                    title: 'Mode',
                    dataSource: ['Multiple', 'Tags', 'Single'],
                },
                autoClearSearchValue: {
                    title: 'Auto Clear Search Value',
                    tooltip: 'Only used to multiple and tags mode',
                },
                defaultActiveFirstOption: 'Default Active First Option',
                defaultOpen: 'Default Open',
                filterOption: 'Filter Option',
                filterSort: 'Filter Sort',
                labelInValue: 'Label In Value',
                listHeight: 'List Height',
                maxTagCount: 'Max Tag Count',
                maxTagPlaceholder: {
                    title: 'Max Tag Placeholder',
                    tooltip: 'Content displayed when tag is hidden',
                },
                maxTagTextLength: 'Max Tag Text Length',
                notFoundContent: 'Not Found Content',
                showArrow: 'Show Arrow',
                virtual: 'Use Virtual Scroll',
                dropdownMatchSelectWidth: {
                    title: 'Dropdown Match Select Width',
                    tooltip: 'By default, min-width will be set, and it will be ignored when the value is less than the width of the selection box. false will turn off virtual scrolling',
                },
                showCheckedStrategy: {
                    title: 'Show Checked Strategy',
                    tooltip: 'When configuring treeCheckable, define how to backfill the selected item. TreeSelect.SHOW_ALL: Show all selected nodes (including parent nodes). TreeSelect.SHOW_PARENT: Only display the parent node (when all child nodes under the parent node are selected). Only show child nodes by default',
                    dataSource: ['Show All', 'Show Parent Node', 'Show Child Nodes'],
                },
                treeCheckable: 'Tree Checkable',
                treeDefaultExpandAll: 'Tree Default Expand All',
                treeDefaultExpandedKeys: {
                    title: 'Tree Default Expanded Keys',
                    tooltip: 'Format：Array<string | number>',
                },
                treeNodeFilterProp: {
                    title: 'Tree Node Filter Properties',
                    tooltip: 'The treeNode attribute corresponding to the input item filter',
                },
                treeDataSimpleMode: {
                    title: 'Tree Data Simple Mode',
                    tooltip: "Use treeData in a simple format. For specific settings, refer to the settable type (the treeData should be a data structure like this: [{id:1, pId:0, value:'1', title:\"test1\",...} ,...], pId is the id of the parent node)",
                },
                treeNodeLabelProp: {
                    title: 'Tree Node Label Properties',
                    tooltip: 'The default is title',
                },
                filterTreeNode: 'Filter Tree Node',
            },
        },
    },
    'ko-KR': {
        title: '트리 셀렉터',
        settings: {
            'x-component-props': {
                mode: {
                    title: '모드',
                    dataSource: ['다중', '태그', '단일'],
                },
                autoClearSearchValue: {
                    title: '검색값 자동 삭제',
                    tooltip: '다중 모드와 태그 모드에서만 사용 가능',
                },
                defaultActiveFirstOption: '기본 활성값으로 첫번째 옵션 사용',
                defaultOpen: '기본 오픈',
                filterOption: '옵션 필터',
                filterSort: '정렬 필터',
                labelInValue: '레이블 입력 값',
                listHeight: '리스트 높이',
                maxTagCount: '최대 태그 개수',
                maxTagPlaceholder: {
                    title: '최대 태그 Placeholder',
                    tooltip: '태그가 숨김일때 보여줍니다.',
                },
                maxTagTextLength: '최대 태그 문자 길이',
                notFoundContent: '내용 없음',
                showArrow: '화살표 보기',
                virtual: '수직 스크롤 사용',
                dropdownMatchSelectWidth: {
                    title: '드롭다운 너비 맞추기',
                    tooltip: '기본적으로 최소 너비가 설정되며 값이 선택 상자의 너비보다 작으면 무시됩니다.',
                },
                showCheckedStrategy: {
                    title: '선택한 전략 표시',
                    tooltip: 'treeCheckable을 구성할 때 선택한 항목을 다시 채우는 방법을 정의합니다. TreeSelect.SHOW_ALL: 선택한 모든 노드(상위 노드 포함)를 표시합니다. TreeSelect.SHOW_PARTE: 상위 노드 아래의 모든 하위 노드를 선택한 경우에만 상위 노드를 표시합니다. 기본적으로 하위 노드만 표시합니다',
                    dataSource: ['모두 보기', '부모 노드만 보기', '자식 노드만 보기'],
                },
                treeCheckable: '트리 체크 가능 여부',
                treeDefaultExpandAll: '트리 기본 모두 확장',
                treeDefaultExpandedKeys: {
                    title: '트리 기본 확장 키',
                    tooltip: '형식：Array<string | number>',
                },
                treeNodeFilterProp: {
                    title: '트리 노드 필터 속성',
                    tooltip: '입력 항목 필터에 해당하는 treeNode 속성',
                },
                treeDataSimpleMode: {
                    title: '트리 데이터 심플 모드',
                    tooltip: "treeData\uB97C \uAC04\uB2E8\uD55C \uD615\uC2DD\uC73C\uB85C \uC0AC\uC6A9\uD569\uB2C8\uB2E4. \uD2B9\uC815 \uC124\uC815\uC740 \uC124\uC815\uAC00\uB2A5\uD55C \uC720\uD615\uC744 \uCC38\uC870\uD558\uC138\uC694 (\uD2B8\uB9AC\uB370\uC774\uD130\uB294 \uB2E4\uC74C\uACFC \uAC19\uC740 \uB370\uC774\uD130 \uAD6C\uC870\uC5EC\uC57C \uD569\uB2C8\uB2E4: [{id:1, pId:0, value:'1', title:\"test1\",...} ,...], pId\uB294 id\uC758 \uC0C1\uC704 \uB178\uB4DC\uC785\uB2C8\uB2E4).",
                },
                treeNodeLabelProp: {
                    title: '트리 노드 레이블 속성',
                    tooltip: '기본 값은 제목',
                },
                filterTreeNode: '트리 노드 필터',
            },
        },
    },
};
