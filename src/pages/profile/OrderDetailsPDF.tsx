import { Images } from 'src/assets/images';
import { parseDate, fullFormatDateMonthYear, toPascalCase } from 'src/utils/customFunctions';

const OrderDetailsPDF = (props: any) => {

  const userData: any = localStorage.getItem("user");
  const userDetails: any = userData && JSON.parse(userData)
  const { orderId, orderIdNum, orderCreatedOn, paymentMethod, paymentStatus, productDetails, cardDetails } = props.data;
  const formatedDate:string = parseDate(orderCreatedOn);
  const fullFormattedDate: string = fullFormatDateMonthYear(formatedDate);
  // Currency code and symbol
  let currencyCode = productDetails[0] ? productDetails[0].currencyCode?.substring(0, 2) : ''
  let currencySymbol =  productDetails[0] ?  productDetails[0].currencySymbol : ''

  // Capitalize the first letter
  const capFirstLetter = (string: any) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  let allPrice = productDetails?.length ? productDetails?.map((i:any) => i.price) : 0;
  // const totalAmount  = allPrice.length ? allPrice.reduce((a:any, b:any) => a + b, 0) : 0;

  let displayedPaymentMethod = (paymentMethod === 'card') ? toPascalCase(cardDetails?.brand) +' Ending ****' + cardDetails?.last4 : 'Paypal';

  return (
    <div>
      <div style={{ backgroundColor: "#E5E5E5", margin: "auto" }} className="order-detils-invoice-container" id={`template_invoice-${orderId}`}>
        <div className=''>
          <div style={{ backgroundColor: "#ffffff", padding: "0px 0px 0px 0px", height: "auto", margin: "auto" }}>
            {/* Download invoice format */}
            <table width="100%" cellSpacing="0" cellPadding="0" style={{ borderSpacing: 0, margin: "auto" }}>
              <tr>
                <td>
                  <div className='site-hero-logo' style={{paddingLeft:"50px", paddingTop:"40px"}}>
                    <img src={Images.stallionlogo}  style={{width: "200px", height:"35px"}}/>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <table cellSpacing="0" cellPadding="0" vertical-align='top' width="600"  style={{ margin: "0px auto" }} >
                    <tr>
                      <td>
                        <h1 style={{ textAlign: "left", margin: 0, padding: "40px 0px 10px 0px", fontFamily: "FlechaM-Medium", fontSize: "56px", color: "#0C1014", fontWeight: "400", lineHeight: "72px" }}>Order Confirmed</h1>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style={{ margin: 0, padding: "20px 0px 0px 0px", fontFamily: "Synthese-Regular", fontSize: "18px", color: "#515759", lineHeight: "27px" }}>Hello {userDetails?.fullName},</p>
                        <p style={{ margin: 0, padding: "25px 0px 20px 0px", fontFamily: "Synthese-Regular", fontSize: "18px", color: "#515759", lineHeight: "27px" }}>
                          Thank you for your recent order! Your order details are shown below for your reference.
                        </p>

                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingBottom: "20px" }}>
                        <p style={{ margin: 0, padding: "0px 0px 12px 0px", fontFamily: "Synthese-Book", fontSize: "20px", fontWeight: "400", color: "#1D472E" }}><strong style={{fontFamily: "Synthese-Bold", fontWeight:"600"}}>Date:</strong> {fullFormattedDate}</p>
                        <p style={{ margin: 0, padding: "0px 0px 12px 0px", fontFamily: "Synthese-Book", fontSize: "20px", fontWeight: "400", color: "#1D472E" }}><strong style={{fontFamily: "Synthese-Bold", fontWeight:"600"}}>Order Number:</strong> {orderIdNum}</p>
                        <p style={{ margin: 0, padding: "0px 0px 12px 0px", fontFamily: "Synthese-Book", fontSize: "20px", fontWeight: "400", color: "#1D472E" }}><strong style={{fontFamily: "Synthese-Bold", fontWeight:"600"}}>Order Status: </strong> {`${capFirstLetter(paymentStatus)}`}</p>
                        <p style={{ margin: 0, padding: "0px 0px 12px 0px", fontFamily: "Synthese-Book", fontSize: "20px", fontWeight: "400", color: "#1D472E" }}><strong style={{fontFamily: "Synthese-Bold", fontWeight:"600"}}>Payment Method:</strong> {`${displayedPaymentMethod}`}</p>
                      </td>
                    </tr>
                    <tr>
                      <td valign="middle">
                        {productDetails?.map((item: any, index: any) => {
                          let displayedDisplayedName = (item?.horseName) ? item?.horseName : item?.productCategoryName ;
                          return (
                            <table key={index} cellSpacing="0" cellPadding="0" vertical-align='top' width="600" style={{ marginTop: "0px", borderTop: "solid 1px #DFE1E4", textAlign: "center", borderBottom: "solid 1px #DFE1E4", paddingTop: "20px", paddingBottom: "10px" }}>
                              <tr>
                                <td style={{ textAlign: "left" }}>
                                  <h2 style={{ margin: "0px", padding: "10px 0px 5px 0px", fontFamily: " Synthese-Book", fontSize: "16px", color: "#161716", fontWeight: 400, lineHeight: "22px" }}><b>{item.productName}</b></h2>
                                  <p style={{ margin: 0, padding: "5px 0px 0px 0px", fontFamily: " Synthese-Book", fontSize: "16px", color: "#1D472E", fontWeight: "400", lineHeight: "20px" }}>{`${toPascalCase(displayedDisplayedName)} x ${item.quantity}`}</p>
                                </td>
                                <td align="right">
                                  <p style={{ margin: 0, padding: "5px 0px 0px 0px", fontFamily: " Synthese-Book", fontSize: "20px", color: "#1D472E", fontWeight: "400", lineHeight: "22px" }}>{item.currencyCode?.substring(0, 2)} {currencySymbol}{item.price}</p>
                                </td>
                              </tr>
                            </table>
                          )
                        })}
                        <table cellSpacing="0" cellPadding="0" vertical-align='top' width="600" style={{ textAlign: "center", marginTop: 0, paddingTop: "20px", paddingBottom: "10px", lineHeight: 1, borderSpacing: 0 }}>
                          <tr>
                            <td align="left">
                              <h2 style={{ margin: 0, padding: "5px 0px 5px 0px", fontFamily: "Synthese-Book", fontSize: "20px", color: "#161716", fontWeight: "400" }}>Subtotal</h2>
                            </td>
                            <td align="right">
                              <p style={{ margin: 0, padding: "5px 0px 0px 0px", fontFamily: "Synthese-Book", fontSize: "20px", color: "#161716", fontWeight: "400" }}>{currencyCode || "AU"} {currencySymbol || "$"}{props.data.subTotal}</p>
                            </td>
                          </tr>
                          <tr>
                            <td align="left">
                              <h2 style={{ margin: 0, padding: "5px 0px 5px 0px", fontFamily: "Synthese-Book", fontSize: "20px", color: "#161716", fontWeight: "400" }}>Discount</h2>
                            </td>
                            <td align="right">
                              <p style={{ margin: 0, padding: "5px 0px 0px 0px", fontFamily: "Synthese-Regular", fontSize: "20px", color: "#C75227", fontWeight: "400" }}>{currencyCode || "AU"} {currencySymbol || "$"}{props.data.discount ? props.data.discount : '0'}</p>
                            </td>
                          </tr>
                          <tr>
                            <td align="left">
                              <h2 style={{ margin: 0, padding: "5px 0px 5px 0px", fontFamily: "Synthese-Book", fontSize: "20px", color: "#161716", fontWeight: "400" }}>Tax ({props.data.taxPercentage ? props.data.taxPercentage : 0}%)</h2>

                            </td>
                            <td align="right">
                              <p style={{ margin: 0, padding: "5px 0px 0px 0px", fontFamily: "Synthese-Book", fontSize: "20px", color: "#161716", fontWeight: "400" }}>{currencyCode || "AU"} {currencySymbol || "$"}{props.data.taxValue ? props.data.taxValue : '0'}</p>
                            </td>
                          </tr>
                          <tr>
                            <td align="left">
                              <h2 style={{ margin: "0px", padding: "20px 0px 5px 0px", fontFamily: "Synthese-Regular", fontSize: "20px", color: "#161716", fontWeight: "600" }}>Total</h2>

                            </td>
                            <td align="right">
                              <p style={{ margin: "0px", padding: "20px 0px 0px 0px", fontFamily: "Synthese-Regular", fontSize: "20px", color: "#161716", fontWeight: "600" }}>{currencyCode || "AU"} {currencySymbol || "$"}{props.data.total}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            {/* End Download invoice format */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsPDF;