package org.colorcoding.ibas.sales.data;

import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.common.Value;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 协议方式
 * 
 * @author Niuren.Zhu
 *
 */
@XmlType(namespace = MyConfiguration.NAMESPACE_BO)
public enum emAgreementMethod {
	/**
	 * 物料
	 */
	@Value("I")
	ITEM,
	/**
	 * 货币
	 */
	@Value("M")
	MONETARY
}
