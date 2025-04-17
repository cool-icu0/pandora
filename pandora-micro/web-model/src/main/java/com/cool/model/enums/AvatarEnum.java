package com.cool.model.enums;

import lombok.Getter;

/**
 * @Author Cool
 * @Date 2025/1/8 下午3:41
 */

@Getter
public enum AvatarEnum {
    AVATAR_1("https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png"),
    AVATAR_2("https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png"),
    AVATAR_3("https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"),
    AVATAR_4("https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png"),
    AVATAR_5("https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png"),
    AVATAR_6("https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png");


    private final String url;
    AvatarEnum(String url) {
        this.url = url;
    }

    //随机获取一个头像
    public static String getRandomAvatar() {
        int index = (int) (Math.random() * values().length);
        return values()[index].getUrl();
    }
}
