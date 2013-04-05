<!-- name:appItem -->
<div class="app-item">
    <a href="#{url}" class="icon icon-app-#{type}"></a>
    <h4><a href="#{url}">#{title:h}</a>#{status}</h4>
    #{content}
    <p class="opt">#{opt}</p>
</div>

<!-- name:content -->
<p class="#{className}">#{content}</p>

<!-- name:invalid -->
<span class="red"> 失效<a href="#" class="icon icon-tip" title="#{text}"></a></span>

<!-- name:button -->
<span class="ui-button ui-button-label ui-button-#{type}" data-click="#{action}" #{attr}>#{text:h}</span>

<!-- name:opt -->
<a href="#{style}">样式</a> 
<a href="#{setting}">设置</a> 
<a href="#{report}">报表</a>
<a href="#{financial}">财务</a>

<!-- name:optMore -->
<a href="#{url}">了解更多</a> 
