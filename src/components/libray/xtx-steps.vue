<script lang="jsx">

export default {
    name: 'XtxSteps',
    props: {
        active: {
            type: [Number, String],
            default: 1
        }
    },
    setup(props) {
        let activs = props.active
        return { activs }
    },
    render() {
        // 确定一个容器
        // 根据默认插槽的内容渲染内容添加
        let itemSlot = this.$slots.default()


        // 准备一个容器展开数据(因为有些是使用v-for渲染的)
        let SlotSetps = []
        itemSlot.forEach((item) => {
            if (item.type.name == "XtxStepsItem") {
                SlotSetps.push(item)
            } else if (item.children.length != 0) {
                item.children.forEach(citem => {
                    SlotSetps.push(citem)
                })
            }
        });


        // 渲染jsx-item
        let itemJsx = SlotSetps.map((item, i) => {
            // class={{ active: i < activs }} 
            return <div class={{ "xtx-steps-item": true, "active": i < this.active }} >
                <div class="step"><span>{i + 1}</span></div>
                <div class="title">{item.props.title}</div>
                <div class="desc">{item.props.desc}</div>
            </div>

        })


        // 渲染容器
        return <div class="xtx-steps">{itemJsx}</div>



    }
}
</script>
<style lang="less">
.xtx-steps {
    display: flex;
    text-align: center;
    padding: 10px;

    &-item {
        flex: 1;

        &:first-child {
            .step {
                &::before {
                    display: none;
                }
            }
        }

        &:last-child {
            .step {
                &::after {
                    display: none;
                }
            }
        }

        &.active {
            .step {
                >span {
                    border-color: @xtxColor;
                    background: @xtxColor;
                    color: #fff
                }

                &::before,
                &::after {
                    background: @xtxColor;
                }
            }

            .title {
                color: @xtxColor;
            }
        }

        .step {
            position: relative;

            >span {
                width: 48px;
                height: 48px;
                font-size: 28px;
                border: 2px solid #e4e4e4;
                background: #fff;
                border-radius: 50%;
                line-height: 44px;
                color: #ccc;
                display: inline-block;
                position: relative;
                z-index: 1;
            }

            &::after,
            &::before {
                content: "";
                position: absolute;
                top: 23px;
                width: 50%;
                height: 2px;
                background: #e4e4e4;
            }

            &::before {
                left: 0;
            }

            &::after {
                right: 0;
            }
        }

        .title {
            color: #999;
            padding-top: 12px;
        }

        .desc {
            font-size: 12px;
            color: #999;
            padding-top: 6px;
        }
    }
}
</style>