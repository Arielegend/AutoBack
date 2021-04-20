# autolog-rates

#### Core package of classes and types to create Rate Lines from submission and Quote calculation.

Each **Rate Submission** in the Autolog system is designed to reflect the structure of international shipping. <br>
In order to store, preview and consume a given **Rate Submission Upload**, we divide this process into 2 parts:

- Rate Preview Storage.
- Rate Query Storage.

**The Motivation:** <br>
When we want to preview a given rate, we want to see the rate as we submitted it. <br>
A Rate Set has meaning as it is (it is general offering by a certain freight forwarder).<br>
When a Quote Request is made by a Client, we are not necessarily interested in a specific offering,<br>
we are interested in all such offerings that fit a Rate Type,<br>
**Point of Origin, Point of Destination, Date of Readiness, Date of Arrival**.

We therefore can therefore define each Rate in the following way:<br>
**A given Rate Offering has:**
- Rate Type
- Dates of Validity
- Origin Charges
- Freight Transport Charges
- Local Charges

For each Quote Request we actually look for parameters according to specific charges applying to **Point of Origin, Point of Destination**,<br> 
so consider all charges relevant for a specific pair **RateType#Point of Origin#Point of Destination** to be base charges, while all other charges<br>
to a specific Quote Request we consider universal. 

We therefore process each Rate Offering and transform it to a RateLineSet, a list of RateLines which contain a single **Base Rate**,<br> 
**Rate GeneralInfo** and other **Charges**.

**Charges:** <br>
For each charge we implement a class implementing the **Charge Map** Generic Interface, and each charge knows how to calculate itself <br>
(optionally takes some parameters defined according to shipment details), to instantiate from cleaned up updates and to stringify itself <br>
to a map-like ```[[key, string]]``` array of arrays and then instantiate itself from a string.

We therefore encapsulate all such possible charges applying to any given charge to a string,<br>
and know how to parse it according to a given **Rate Type** (i.e. instantiate all charges according to what a given **Rate Type** must contain),<br>
since it contains all information regarding the specific charges we can expect in charge.<br>

All charges live (except for Courier Rates), in 3 different parts: **Origin Charges, Freight Transport Charges, Local Charges**.<br>
Charges mostly differ according to the Cargo Load parameter.


Quote Requests and Offers:
-------------------------

To find a specific rate, we must find all relevant RateLines in **Rate Query Storage**, and apply all charges in each <br>
part to obtain a total price. To avoid further complexities, we only show Mandatory Charges and skip non-mandatory until later<br>
(but still conserve information about it).<br>  

Then we instantiate each ChargeMap object and apply <br>
```calcMe(calcMe(shipmentDetails?: ContainerDetails[] | BoxDetails[], mode?: ModeOfTransport): TotalCostAnyRulesTable | InvalidChargeSetMessage<T>)``` 
giving us the relevant total for that charge.

Adding up all charges gives us a grand total which we return to the developer consuming this QuoteRateLineCalc class.
 